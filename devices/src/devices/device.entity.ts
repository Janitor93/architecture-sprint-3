import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serial: string;

  @Column()
  type: string;

  @Column()
  status: 'on' | 'off';
}
