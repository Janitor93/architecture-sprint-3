import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  OnModuleInit,
} from '@nestjs/common';
import { Client, ClientKafka, EventPattern } from '@nestjs/microservices';
import { TelemetryService } from './telemetry.service';
import { Telemetry } from './telemetry.entity';
import { microserviceConfig } from '../microserviceConfig';

@Controller('telemetry')
export class TelemetryController implements OnModuleInit {
  constructor(private telemetryService: TelemetryService) {}

  @Client(microserviceConfig)
  client: ClientKafka;

  onModuleInit() {
    const requestPatterns = ['sensor_data'];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @Post('/:deviceId')
  async addTelemetry(
    @Param('deviceId') deviceId: string,
    @Body() telemetry: Omit<Telemetry, 'device_id' | 'timestamp'>,
  ): Promise<Telemetry> {
    return await this.telemetryService.addTelemetry({
      ...telemetry,
      device_id: deviceId,
    });
  }

  @Get()
  async getAllHistory(@Query('page') page: number) {
    return await this.telemetryService.getTelemetry(page);
  }

  @Get('/:deviceId')
  async getHistoryByDevice(
    @Query('page') page: number,
    @Param('deviceId') deviceId: string,
  ) {
    return await this.telemetryService.getTelemetry(page, deviceId);
  }

  @EventPattern('sensor_data')
  async handleEntityCreated(payload: any) {
    try {
      const { deviceId, ...data } = payload;
      this.telemetryService.addTelemetry({ device_id: deviceId, data });
    } catch (error) {
      console.error('Kafka error', error.message);
    }
  }
}
