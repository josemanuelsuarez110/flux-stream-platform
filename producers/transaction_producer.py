import json
import random
import time
import uuid
from datetime import datetime
from confluent_kafka import Producer

class FluxTransactionProducer:
    """Simulates high-velocity financial transactions for FluxStream."""
    
    def __init__(self, bootstrap_servers='localhost:9092'):
        self.producer = Producer({
            'bootstrap.servers': bootstrap_servers,
            'client.id': 'flux_producer_1',
            'acks': 'all',
            'retries': 5,
            'compression.type': 'lz4'
        })
        self.topic = 'transactions.raw'
        self.merchants = ['Amazon', 'Walmart', 'Stripe', 'Netflix', 'Uber', 'Starbucks']
        self.card_pool = [str(uuid.uuid4())[:8] for _ in range(500)] # 500 active cards

    def delivery_report(self, err, msg):
        """Callback for delivery reports from Kafka."""
        if err is not None:
            print(f'Delivery failed for record {msg.key()}: {err}')
        else:
            print(f'Record {msg.key()} successfully sent to {msg.topic()} [{msg.partition()}]')

    def generate_transaction(self, card_id=None, amount_range=(5, 2000)):
        """Generates a realistic transaction JSON."""
        return {
            "transaction_id": str(uuid.uuid4()),
            "card_id": card_id or random.choice(self.card_pool),
            "merchant": random.choice(self.merchants),
            "amount": round(random.uniform(*amount_range), 2),
            "currency": "USD",
            "lat": round(random.uniform(25, 49), 4),  # USA Lat
            "long": round(random.uniform(-125, -67), 4), # USA Long
            "timestamp": datetime.utcnow().isoformat()
        }

    def simulate_streaming(self, duration_sec=60, batch_size=5):
        """Starts the streaming simulation."""
        print(f"🚀 Starting FluxStream Simulation for {duration_sec}s...")
        start_time = time.time()
        
        while time.time() - start_time < duration_sec:
            # Normal Flow
            for _ in range(batch_size):
                tx = self.generate_transaction()
                self.producer.produce(
                    self.topic,
                    key=tx['card_id'],
                    value=json.dumps(tx),
                    callback=self.delivery_report
                )
            
            # 🧩 FRAUD ALERT SIMULATION: 5 transactions in 2 seconds for a single card
            if random.random() < 0.1: # 10% chance of a fraudulent burst
                fraud_card = random.choice(self.card_pool)
                print(f"⚠️ SIMULATING FRAUD BURST for card {fraud_card}")
                for _ in range(5):
                    tx = self.generate_transaction(card_id=fraud_card, amount_range=(500, 5000))
                    self.producer.produce(
                        self.topic,
                        key=fraud_card,
                        value=json.dumps(tx),
                        callback=self.delivery_report
                    )
                    time.sleep(0.2) # Rapid burst
            
            self.producer.flush()
            time.sleep(1) # Interval

if __name__ == "__main__":
    producer = FluxTransactionProducer()
    producer.simulate_streaming()
