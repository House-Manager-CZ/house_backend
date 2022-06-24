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

enum HOUSE_STATUSES {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

@Entity({
  name: DB_TABLES.HOUSES,
})
export default class HouseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    array: false,
    enum: Object.values(HOUSE_STATUSES),
    default: HOUSE_STATUSES.ACTIVE,
  })
  status: HOUSE_STATUSES;

  @Column({
    type: 'geography',
    nullable: true,
  })
  location: Point | (() => string);

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

export { HOUSE_STATUSES };
