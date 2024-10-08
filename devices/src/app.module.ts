import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DevicesController } from './devices/devices.controller';
import { DevicesService } from './devices/devices.service';
import { Device } from './devices/device.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Device],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Device]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class AppModule {}
