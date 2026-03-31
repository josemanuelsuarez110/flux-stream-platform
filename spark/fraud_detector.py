import os
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, window, count, expr, current_timestamp
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, TimestampType

# 🛠️ Configuration
KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"
INPUT_TOPIC = "transactions.raw"
OUTPUT_TOPIC = "fraud.alerts"
CHECKPOINT_LOCATION = "flux-stream-platform/spark/checkpoints"

# 📋 Schema definition for transaction data
transaction_schema = StructType([
    StructField("transaction_id", StringType(), True),
    StructField("card_id", StringType(), True),
    StructField("merchant", StringType(), True),
    StructField("amount", DoubleType(), True),
    StructField("currency", StringType(), True),
    StructField("lat", DoubleType(), True),
    StructField("long", DoubleType(), True),
    StructField("timestamp", StringType(), True)
])

def create_spark_session():
    """Initializes Spark Session with Kafka support."""
    return SparkSession.builder \
        .appName("FluxStream-FraudDetector") \
        .config("spark.streaming.stopGracefullyOnShutdown", "true") \
        .getOrCreate()

def process_fraud_stream():
    """Main streaming pipeline logic."""
    spark = create_spark_session()
    spark.sparkContext.setLogLevel("WARN")

    # 1. READ FROM KAFKA
    df = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS) \
        .option("subscribe", INPUT_TOPIC) \
        .option("startingOffsets", "latest") \
        .load()

    # 2. PARSE JSON DATA & CAST TYPES
    transactions = df.selectExpr("CAST(value AS STRING)") \
        .select(from_json(col("value"), transaction_schema).alias("data")) \
        .select("data.*") \
        .withColumn("event_time", col("timestamp").cast(TimestampType()))

    # 3. 🧠 DEFINE FRAUD LOGIC: High-Frequency detection
    # Threshold: More than 3 transactions in a 1-minute sliding window
    # Watermarking: Handle late data up to 5 minutes
    fraud_candidates = transactions \
        .withWatermark("event_time", "5 minutes") \
        .groupBy(
            window(col("event_time"), "1 minute", "30 seconds"),
            col("card_id")
        ) \
        .agg(count("*").alias("tx_count")) \
        .filter(col("tx_count") > 3) \
        .withColumn("fraud_alert_id", expr("uuid()")) \
        .withColumn("alert_timestamp", current_timestamp())

    # 4. WRITING ALERTS TO KAFKA
    alert_query = fraud_candidates.selectExpr(
        "CAST(card_id AS STRING) AS key",
        "to_json(struct(*)) AS value"
    ).writeStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS) \
        .option("topic", OUTPUT_TOPIC) \
        .option("checkpointLocation", f"{CHECKPOINT_LOCATION}/alerts") \
        .outputMode("update") \
        .start()

    # 5. WRITING RAW DATA TO DELTA/PARQUET (Data Lake)
    raw_storage_query = transactions.writeStream \
        .format("parquet") \
        .option("path", "flux-stream-platform/data/bronze/transactions") \
        .option("checkpointLocation", f"{CHECKPOINT_LOCATION}/raw_storage") \
        .partitionBy("card_id") \
        .start()

    print("⚡ FluxStream Fraud Detector is LIVE and processing...")
    
    spark.streams.awaitAnyTermination()

if __name__ == "__main__":
    process_fraud_stream()
