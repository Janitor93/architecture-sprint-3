import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';

@Injectable()
export class DevicesService {
  private readonly devicesRepository: Repository<Device>;

  constructor(@InjectRepository(Device) devicesRepository) {
    this.devicesRepository = devicesRepository;
  }

  async getDevices(): Promise<Device[]> {
    return await this.devicesRepository.find();
  }

  async getDeviceById(id: string): Promise<Device> {
    return await this.devicesRepository.findOne({ where: { id } });
  }

  async addDevice(device: Device): Promise<Device> {
    const newDevice = this.devicesRepository.create(device);
    return await this.devicesRepository.save(newDevice);
  }

  async updateDevice(id, device: Partial<Device>) {
    const result = await this.devicesRepository.update({ id }, { ...device });
    return result;
  }
}
