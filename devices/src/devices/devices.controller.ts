import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  OnModuleInit,
} from '@nestjs/common';
import { Client, ClientKafka, EventPattern } from '@nestjs/microservices';
import { Device } from './device.entity';
import { DevicesService } from './devices.service';
import { microserviceConfig } from '../microserviceConfig';

@Controller('devices')
export class DevicesController implements OnModuleInit {
  constructor(private devicesService: DevicesService) {}

  @Client(microserviceConfig)
  client: ClientKafka;

  onModuleInit() {
    const requestPatterns = ['device_command'];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @EventPattern('device_command')
  async handleEntityCreated(payload: any) {
    try {
      const { action, id } = payload;
      console.log(action, id);
      if (action === 'turn_on') {
        this.devicesService.updateDevice(id, { status: 'on' });
      } else if (action === 'turn_off') {
        this.devicesService.updateDevice(id, { status: 'off' });
      }
    } catch (error) {
      console.error('Kafka error', error.message);
    }
  }

  @Get()
  async getDevices(): Promise<Device[]> {
    return await this.devicesService.getDevices();
  }

  @Get('/:id')
  async getDeviceById(@Param('id') id: string): Promise<Device> {
    return await this.devicesService.getDeviceById(id);
  }

  @Post()
  async addDevice(@Body() device: Device): Promise<Device> {
    return await this.devicesService.addDevice(device);
  }

  @Put('/:id')
  async updateDevice(@Param('id') id: string, @Body() device: Partial<Device>) {
    const currentDevice = await this.devicesService.getDeviceById(id);
    if (!currentDevice) throw new Error('Device not found');
    return await this.devicesService.updateDevice(id, {
      ...currentDevice,
      ...device,
    });
  }

  @Get('/:id/status')
  async getDeviceStatus(
    @Param('id') id: string,
  ): Promise<{ status: 'on' | 'off' }> {
    const device = await this.devicesService.getDeviceById(id);
    return { status: device.status };
  }
}
