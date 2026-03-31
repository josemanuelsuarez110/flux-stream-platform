# ⚡ FluxStream: High-Performance Real-Time Fraud Detection

[![Spark Streaming](https://img.shields.io/badge/Apache_Spark-Streaming-orange.svg)](https://spark.apache.org/)
[![Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Store-black.svg)](https://kafka.apache.org/)
[![Airflow](https://img.shields.io/badge/Apache_Airflow-Orchestrator-blue.svg)](https://airflow.apache.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)

**FluxStream** is a production-grade, real-time data streaming platform designed to identify fraudulent credit card transactions at scale. This project demonstrates advanced Event-Driven Architecture (EDA) principles, stateful streaming, and high-availability infrastructure.

## 🚀 Key Features

*   **Real-Time Processing**: Millisecond latency from event ingestion to fraud detection.
*   **Window-Based Aggregations**: Sliding windows (1 min) to detect transaction bursts using **Spark Structured Streaming**.
*   **Fault Tolerance**: Checkpointing and exactly-once semantics for data reliability.
*   **Late Data Handling**: Watermarking (5 min) to process events that arrive out-of-order.
*   **Scalable Ingestion**: Partitioned **Kafka** topics for horizontal throughput scaling.
*   **Automated Ops**: **Airflow** DAGs for topic lifecycle and Data Lake maintenance.
*   **Premium Frontend**: Next.js 15 monitoring command center with interactive architecture visualizations.

---

## 🏗️ Architecture Design

The system follows a modern streaming pipeline flow:

```text
[ Producers ] --> [ Kafka (transactions.raw) ] --> [ Spark Streaming ]
                                                          |
                                           /--------------+--------------\
                                          |                               |
                             [ Kafka (fraud.alerts) ]             [ Data Lake (Parquet) ]
                                          |                               |
                             [ Monitoring Dashboard ]        [ Historical Analytics / AI ]
```

### Technical Decisions
1.  **Kafka Partitions (6)**: Optimized for parallelism across multiple Spark executors.
2.  **Watermarking**: Essential for financial data where network latency can cause late event arrivals.
3.  **Delta Lake / Parquet**: Sink chosen for ACID compliance and high-performance read patterns in downstream BI.

---

## 📂 Repository Structure

```text
/flux-stream-platform
│── kafka/               # Kafka Topology and Cluster Configurations
│── spark/               # Pyspark Structured Streaming Engine
│── airflow/             # DAGs for Orchestration and Maintenance
│── producers/           # High-throughput Python Simulators
│── frontend/            # Next.js 15 Portfolio / Monitoring Dashboard
│── docs/                # Detailed Technical Setup Guides
└── README.md
```

---

## 🛠️ Getting Started

### 1. Ingestion Logic
The Python producer in `producers/transaction_producer.py` simulates realistic e-commerce traffic, including intentional fraud bursts (5+ transactions in 10s from a single card).

### 2. Streaming Engine
Run the Spark job to start the fraud detection engine:
```bash
spark-submit --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.x spark/fraud_detector.py
```

### 3. Monitoring UI
```bash
cd frontend && npm install && npm run dev
```

---

## 📊 Use Case: Fraud Detection Logic
The system identifies "High-Frequency Bursts":
*   **Threshold**: > 3 transactions per 1-minute sliding window.
*   **Outcome**: Immediate alert pushed to `fraud.alerts` topic.
*   **Enrichment**: Transactions are partitioned by `card_id` in the Data Lake for cold storage analysis.

---

## 👨‍💻 Author
**[Your Name/Portfolio]**
*   Professional Data Engineer / Streaming Architect
*   [LinkedIn Link]
*   [Portfolio Website]
