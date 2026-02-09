import { Module } from '@nestjs/common';
import { IngestModule } from './ingest/ingest.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [IngestModule, AnalyticsModule],
})
export class AppModule {}
