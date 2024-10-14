import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Telemetry } from './telemetry.entity';

@Injectable()
export class TelemetryService {
  private readonly telemetryRepository: Repository<Telemetry>;
  private RECORDS_PER_PAGE = 20;

  constructor(@InjectRepository(Telemetry) telemetryRepository) {
    this.telemetryRepository = telemetryRepository;
  }

  async addTelemetry(
    telemetry: Omit<Telemetry, 'timestamp' | 'id'>,
  ): Promise<Telemetry> {
    const newTelemetry = this.telemetryRepository.create({
      ...telemetry,
      timestamp: new Date(),
    });
    console.log('newTelemetry', newTelemetry);
    return await this.telemetryRepository.save(newTelemetry);
  }

  async getTelemetry(
    page: number = 0,
    deviceId?: string,
  ): Promise<Telemetry[]> {
    const [result] = await this.telemetryRepository.findAndCount({
      ...(deviceId ? { device_id: deviceId } : {}),
      take: this.RECORDS_PER_PAGE,
      skip: page * this.RECORDS_PER_PAGE,
    });

    return result;
  }
}
