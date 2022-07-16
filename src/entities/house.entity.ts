import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DB_TABLES } from '../db/constants';
import { Point } from 'geojson';
import UserEntity, { USER_ENTITY_KEYS } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum HOUSE_STATUSES {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export enum HOUSE_FOREIGN_KEYS {
  OWNER = 'fk_houses_owner',
}

export enum HOUSE_ENTITY_KEYS {
  ID = 'id',
  NAME = 'name',
  STATUS = 'status',
  LOCATION = 'location',
  OWNER = 'owner',
  MEMBERS = 'members',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  DELETED_AT = 'deleted_at',
}

@Entity({
  name: DB_TABLES.HOUSES,
})
export default class HouseEntity {
  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.ID,
    description: 'House ID',
    type: 'string',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  [HOUSE_ENTITY_KEYS.ID]: string;

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.NAME,
    description: 'House name',
    type: 'string',
    required: true,
  })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  [HOUSE_ENTITY_KEYS.NAME]: string;

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.STATUS,
    description: 'House status',
    enum: HOUSE_STATUSES,
    default: HOUSE_STATUSES.ACTIVE,
    required: true,
  })
  @Column({
    type: 'enum',
    array: false,
    enum: Object.values(HOUSE_STATUSES),
    default: HOUSE_STATUSES.ACTIVE,
  })
  [HOUSE_ENTITY_KEYS.STATUS]: HOUSE_STATUSES;

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.LOCATION,
    description: 'House location',
    type: 'object',
    required: true,
    example: {
      type: 'Point',
      coordinates: [0, 0],
    },
  })
  @Column({
    type: 'geography',
    nullable: true,
  })
  [HOUSE_ENTITY_KEYS.LOCATION]: Point | (() => string);

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.OWNER,
    description: 'House owner',
    type: () => UserEntity,
    required: true,
  })
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'owner' })
  [HOUSE_ENTITY_KEYS.OWNER]: UserEntity;

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.MEMBERS,
    description: 'House members',
    type: () => UserEntity,
    isArray: true,
    required: true,
  })
  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: DB_TABLES.HOUSE_USERS,
    joinColumn: {
      name: 'house_id',
      referencedColumnName: HOUSE_ENTITY_KEYS.ID,
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: USER_ENTITY_KEYS.ID,
    },
  })
  [HOUSE_ENTITY_KEYS.MEMBERS]: Array<UserEntity>;

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.CREATED_AT,
    description: 'House creation date',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @CreateDateColumn()
  [HOUSE_ENTITY_KEYS.CREATED_AT]: Date;

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.UPDATED_AT,
    description: 'House update date',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @UpdateDateColumn()
  [HOUSE_ENTITY_KEYS.UPDATED_AT]: Date;

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.DELETED_AT,
    description: 'House deletion date',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @DeleteDateColumn()
  [HOUSE_ENTITY_KEYS.DELETED_AT]: Date;
}
