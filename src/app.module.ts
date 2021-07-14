import { Global, Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from './database/database.module';
import { StockModule } from './stock/stock.module';

@Global()
@Module({
  imports: [TerminusModule, DatabaseModule, StockModule],
  controllers: [HealthController],
})
export class AppModule {}
