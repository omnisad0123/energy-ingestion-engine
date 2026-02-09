import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class IngestService {
  private pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  async ingestMeter(data: any) {
    const { meterId, kwhConsumedAc, voltage, timestamp } = data;

    await this.pool.query(
      `INSERT INTO meter_readings (meter_id, kwh_consumed_ac, voltage, timestamp)
       VALUES ($1, $2, $3, $4)`,
      [meterId, kwhConsumedAc, voltage, timestamp],
    );

    await this.pool.query(
      `INSERT INTO current_meter_status (meter_id, kwh_consumed_ac, voltage, last_updated)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (meter_id)
       DO UPDATE SET 
         kwh_consumed_ac = EXCLUDED.kwh_consumed_ac,
         voltage = EXCLUDED.voltage,
         last_updated = EXCLUDED.last_updated`,
      [meterId, kwhConsumedAc, voltage, timestamp],
    );
  }

  async ingestVehicle(data: any) {
    const { vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp } = data;

    await this.pool.query(
      `INSERT INTO vehicle_readings (vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp)
       VALUES ($1, $2, $3, $4, $5)`,
      [vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp],
    );

    await this.pool.query(
      `INSERT INTO current_vehicle_status (vehicle_id, soc, kwh_delivered_dc, battery_temp, last_updated)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (vehicle_id)
       DO UPDATE SET 
         soc = EXCLUDED.soc,
         kwh_delivered_dc = EXCLUDED.kwh_delivered_dc,
         battery_temp = EXCLUDED.battery_temp,
         last_updated = EXCLUDED.last_updated`,
      [vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp],
    );
  }
}
