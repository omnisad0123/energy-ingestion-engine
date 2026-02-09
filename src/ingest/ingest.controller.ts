import { Body, Controller, Post } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('v1/ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post()
  async ingest(@Body() body: any) {
    if (body.meterId) {
      await this.ingestService.ingestMeter(body);
      return { status: 'ok', type: 'meter' };
    }

    if (body.vehicleId) {
      await this.ingestService.ingestVehicle(body);
      return { status: 'ok', type: 'vehicle' };
    }

    return { status: 'error', message: 'Invalid payload' };
  }
}
