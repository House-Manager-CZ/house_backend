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
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    name: EVENT_ENTITY_KEYS.ID,
    description: 'Event ID',
    type: 'string',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  [EVENT_ENTITY_KEYS.ID]: string;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.STATUS,
    description: 'Event status',
    required: true,
    enum: EVENT_STATUSES,
    default: EVENT_STATUSES.ACTIVE,
  })
  @Column({
    type: 'enum',
    array: false,
    enum: Object.values(EVENT_STATUSES),
    default: EVENT_STATUSES.ACTIVE,
  })
  [EVENT_ENTITY_KEYS.STATUS]: EVENT_STATUSES;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.NAME,
    description: 'Event name',
    type: 'string',
    required: true,
  })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  [EVENT_ENTITY_KEYS.NAME]: string;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.HOUSE,
    description: 'Event house',
    type: () => HouseEntity,
    required: true,
  })
  @ManyToOne(() => HouseEntity)
  @JoinColumn({ name: 'house' })
  [EVENT_ENTITY_KEYS.HOUSE]: HouseEntity;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.HOLDING_AT,
    description: 'Event holding at',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @Column({
    type: 'timestamp',
    nullable: false,
  })
  [EVENT_ENTITY_KEYS.HOLDING_AT]: Date;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.OWNER,
    description: 'Event owner',
    type: () => UserEntity,
    required: true,
  })
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'owner' })
  [EVENT_ENTITY_KEYS.OWNER]: UserEntity;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.CREATED_AT,
    description: 'Event created at',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @CreateDateColumn()
  [EVENT_ENTITY_KEYS.CREATED_AT]: Date;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.UPDATED_AT,
    description: 'Event updated at',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @UpdateDateColumn()
  [EVENT_ENTITY_KEYS.UPDATED_AT]: Date;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.DELETED_AT,
    description: 'Event deleted at',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @DeleteDateColumn()
  [EVENT_ENTITY_KEYS.DELETED_AT]: Date;
}
