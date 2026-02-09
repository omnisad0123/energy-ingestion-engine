CREATE TABLE IF NOT EXISTS meter_readings (
  id SERIAL PRIMARY KEY,
  meter_id TEXT NOT NULL,
  kwh_consumed_ac NUMERIC NOT NULL,
  voltage NUMERIC,
  timestamp TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicle_readings (
  id SERIAL PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  soc NUMERIC NOT NULL,
  kwh_delivered_dc NUMERIC NOT NULL,
  battery_temp NUMERIC,
  timestamp TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS current_meter_status (
  meter_id TEXT PRIMARY KEY,
  kwh_consumed_ac NUMERIC NOT NULL,
  voltage NUMERIC,
  last_updated TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS current_vehicle_status (
  vehicle_id TEXT PRIMARY KEY,
  soc NUMERIC NOT NULL,
  kwh_delivered_dc NUMERIC NOT NULL,
  battery_temp NUMERIC,
  last_updated TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meter_readings_time 
ON meter_readings (meter_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_vehicle_readings_time 
ON vehicle_readings (vehicle_id, timestamp DESC);
