import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AnalyticsService {
  private pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  async getPerformance(vehicleId: string) {
    const acResult = await this.pool.query(
      `
      SELECT COALESCE(SUM(kwh_consumed_ac), 0) AS total_ac
      FROM meter_readings
      WHERE meter_id = $1
        AND timestamp >= NOW() - INTERVAL '24 HOURS'
      `,
      [vehicleId],
    );

    const dcResult = await this.pool.query(
      `
      SELECT 
        COALESCE(SUM(kwh_delivered_dc), 0) AS total_dc,
        COALESCE(AVG(battery_temp), 0) AS avg_temp
      FROM vehicle_readings
      WHERE vehicle_id = $1
        AND timestamp >= NOW() - INTERVAL '24 HOURS'
      `,
      [vehicleId],
    );

    const totalAc = Number(acResult.rows[0].total_ac);
    const totalDc = Number(dcResult.rows[0].total_dc);
    const avgTemp = Number(dcResult.rows[0].avg_temp);

    const efficiency = totalAc > 0 ? totalDc / totalAc : 0;

    return {
      vehicleId,
      last24h: {
        totalAc,
        totalDc,
        efficiency,
        avgBatteryTemp: avgTemp,
      },
    };
  }
}
