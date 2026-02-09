# High-Scale Energy Ingestion Engine

Backend service to ingest high-frequency telemetry from Smart Meters and EVs and provide fast analytical insights for fleet performance.

This project implements the core ingestion layer and prepares the foundation for high-scale analytics.

---

## 🚀 Tech Stack
- Backend: NestJS (TypeScript)
- Database: PostgreSQL
- Containerization: Docker, Docker Compose

---

## 🧱 Architecture Overview

The system is designed with Hot & Cold data separation to support:
- Write-heavy ingestion (millions of records/day)
- Fast reads for dashboards & analytics

Cold Store (History – append only)
- meter_readings
- vehicle_readings

Hot Store (Operational – upsert)
- current_meter_status
- current_vehicle_status

This avoids scanning large history tables for “current state” queries.

---

## 🗄️ Database Schema

History Tables (INSERT only)
- meter_readings(meter_id, kwh_consumed_ac, voltage, timestamp)
- vehicle_readings(vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp)

Live Tables (UPSERT)
- current_meter_status(meter_id, kwh_consumed_ac, voltage, last_updated)
- current_vehicle_status(vehicle_id, soc, kwh_delivered_dc, battery_temp, last_updated)

Indexes
- (meter_id, timestamp DESC)
- (vehicle_id, timestamp DESC)

These indexes ensure analytics queries do not perform full table scans.

---

## 🔁 Ingestion Flow (Implemented)

Endpoint
POST /v1/ingest

Meter Payload
{
  "meterId": "M1",
  "kwhConsumedAc": 10.5,
  "voltage": 220,
  "timestamp": "2026-02-09T10:00:00Z"
}

Vehicle Payload
{
  "vehicleId": "V1",
  "soc": 60,
  "kwhDeliveredDc": 8.5,
  "batteryTemp": 32,
  "timestamp": "2026-02-09T10:00:00Z"
}

Behavior
- Each reading is inserted into history tables
- Current state is upserted into live tables

This design supports high write throughput while keeping current status queries fast.

---

## 🐳 How to Run Locally

docker-compose up --build

Service runs at:
http://localhost:3000

---

## 🧪 Test Ingestion

curl -X POST http://localhost:3000/v1/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "V1",
    "soc": 60,
    "kwhDeliveredDc": 8.5,
    "batteryTemp": 32,
    "timestamp": "2026-02-09T10:00:00Z"
  }'

---

## ⚙️ Scale Considerations

- Hot/Cold separation avoids scanning billions of rows for live dashboards
- Indexed time-series tables allow efficient 24-hour analytics
- Append-only history supports auditing and long-term reporting
- Designed to scale for 10,000+ devices sending data every minute (~14.4M records/day)

---

## 🔜 Next Step (Planned)

Analytics endpoint:
GET /v1/analytics/performance/:vehicleId
(24-hour AC vs DC efficiency summary)
