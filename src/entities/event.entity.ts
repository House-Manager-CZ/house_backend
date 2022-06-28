import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DB_TABLES } from '../db/constants';
import HouseEntity from './house.entity';
import UserEntity from './user.entity';

export enum EVENT_STATUSES {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export enum EVENT_FOREIGN_KEYS {
  HOUSE = 'fk_events_house',
  OWNER = 'fk_events_owner',
}

@Entity({
  name: DB_TABLES.EVENTS,
})
export default class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    array: false,
    enum: Object.values(EVENT_STATUSES),
    default: EVENT_STATUSES.ACTIVE,
  })
  status: EVENT_STATUSES;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @ManyToOne(() => HouseEntity)
  @JoinColumn({ name: 'house' })
  house: HouseEntity;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  holding_at: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'owner' })
  owner: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
