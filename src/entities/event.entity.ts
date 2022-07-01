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

export enum EVENT_ENTITY_KEYS {
  ID = 'id',
  STATUS = 'status',
  NAME = 'name',
  HOUSE = 'house',
  HOLDING_AT = 'holding_at',
  OWNER = 'owner',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  DELETED_AT = 'deleted_at',
}

@Entity({
  name: DB_TABLES.EVENTS,
})
export default class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  [EVENT_ENTITY_KEYS.ID]: string;

  @Column({
    type: 'enum',
    array: false,
    enum: Object.values(EVENT_STATUSES),
    default: EVENT_STATUSES.ACTIVE,
  })
  [EVENT_ENTITY_KEYS.STATUS]: EVENT_STATUSES;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  [EVENT_ENTITY_KEYS.NAME]: string;

  @ManyToOne(() => HouseEntity)
  @JoinColumn({ name: 'house' })
  [EVENT_ENTITY_KEYS.HOUSE]: HouseEntity;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  [EVENT_ENTITY_KEYS.HOLDING_AT]: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'owner' })
  [EVENT_ENTITY_KEYS.OWNER]: UserEntity;

  @CreateDateColumn()
  [EVENT_ENTITY_KEYS.CREATED_AT]: Date;

  @UpdateDateColumn()
  [EVENT_ENTITY_KEYS.UPDATED_AT]: Date;

  @DeleteDateColumn()
  [EVENT_ENTITY_KEYS.DELETED_AT]: Date;
}
