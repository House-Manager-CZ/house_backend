import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DB_TABLES } from '../db/constants';
import { Point } from 'geojson';
import UserEntity from './user.entity';
import { JoinColumn } from 'typeorm';

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
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  DELETED_AT = 'deleted_at',
}

@Entity({
  name: DB_TABLES.HOUSES,
})
export default class HouseEntity {
  @PrimaryGeneratedColumn('uuid')
  [HOUSE_ENTITY_KEYS.ID]: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  [HOUSE_ENTITY_KEYS.NAME]: string;

  @Column({
    type: 'enum',
    array: false,
    enum: Object.values(HOUSE_STATUSES),
    default: HOUSE_STATUSES.ACTIVE,
  })
  [HOUSE_ENTITY_KEYS.STATUS]: HOUSE_STATUSES;

  @Column({
    type: 'geography',
    nullable: true,
  })
  [HOUSE_ENTITY_KEYS.LOCATION]: Point | (() => string);

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'owner' })
  [HOUSE_ENTITY_KEYS.OWNER]: UserEntity;

  @CreateDateColumn()
  [HOUSE_ENTITY_KEYS.CREATED_AT]: Date;

  @UpdateDateColumn()
  [HOUSE_ENTITY_KEYS.UPDATED_AT]: Date;

  @DeleteDateColumn()
  [HOUSE_ENTITY_KEYS.DELETED_AT]: Date;
}
