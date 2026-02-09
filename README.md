
````md
# High-Scale Energy Ingestion Engine

Backend service to ingest telemetry from Smart Meters and EVs and provide fast 24-hour performance analytics.

---

## Tech Stack
- NestJS (TypeScript)
- PostgreSQL
- Docker, Docker Compose

---

## Architecture
Cold (History – INSERT only)
- meter_readings
- vehicle_readings

Hot (Operational – UPSERT)
- current_meter_status
- current_vehicle_status

Hot/Cold separation avoids scanning large history tables for current status and analytics.

---

## Database
Tables
- meter_readings(meter_id, kwh_consumed_ac, voltage, timestamp)
- vehicle_readings(vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp)
- current_meter_status(meter_id, kwh_consumed_ac, voltage, last_updated)
- current_vehicle_status(vehicle_id, soc, kwh_delivered_dc, battery_temp, last_updated)

Indexes
- (meter_id, timestamp DESC)
- (vehicle_id, timestamp DESC)

---

## APIs

POST /v1/ingest

Meter Payload
```json
{
  "meterId": "M1",
  "kwhConsumedAc": 10.5,
  "voltage": 220,
  "timestamp": "2026-02-09T10:00:00Z"
}
````

Vehicle Payload

```json
{
  "vehicleId": "V1",
  "soc": 60,
  "kwhDeliveredDc": 8.5,
  "batteryTemp": 32,
  "timestamp": "2026-02-09T10:00:00Z"
}
```

Behavior

* History → INSERT
* Live → UPSERT

GET /v1/analytics/performance/:vehicleId

Returns (last 24h)

* totalAc
* totalDc
* efficiency (DC / AC)
* avgBatteryTemp

---

## Run Locally

```bash
docker-compose up --build
```

API runs at
[http://localhost:3000](http://localhost:3000)

---

## Scale Notes

* Append-only history for audit
* Hot tables for fast current reads
* Indexed time-series queries for 24h analytics

---

## Assumptions

* meterId and vehicleId map to the same logical device for analytics
* No auth, no hosting (assessment scope)

```

This is **final submission-grade README**.  
If you want, I can now give you a **perfect 2-line answer** to paste in the Google Form along with your GitHub link.
```
