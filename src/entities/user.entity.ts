import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DB_TABLES } from '../db/constants';
import { Exclude } from 'class-transformer';

enum USER_STATUSES {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

@Entity({
  name: DB_TABLES.USERS,
})
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    array: false,
    enum: Object.values(USER_STATUSES),
    default: USER_STATUSES.ACTIVE,
  })
  status: USER_STATUSES;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

export { USER_STATUSES };
