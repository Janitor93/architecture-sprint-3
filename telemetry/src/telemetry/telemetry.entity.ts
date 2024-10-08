import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Telemetry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  timestamp: Date;

  @Column('jsonb')
  data: JSON;

  @Column('uuid')
  device_id: string;
}
