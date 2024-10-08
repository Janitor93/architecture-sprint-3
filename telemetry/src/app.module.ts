import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TelemetryController } from './telemetry/telemetry.controller';
import { TelemetryService } from './telemetry/telemetry.service';
import { Telemetry } from './telemetry/telemetry.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Telemetry],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Telemetry]),
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class AppModule {}
