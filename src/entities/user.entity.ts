import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DB_TABLES } from '../db/constants';
import { Exclude } from 'class-transformer';
import { hashSync } from 'bcrypt';

enum USER_STATUSES {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export enum USER_ENTITY_KEYS {
  ID = 'id',
  STATUS = 'status',
  USERNAME = 'username',
  EMAIL = 'email',
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  DELETED_AT = 'deleted_at',
}

@Entity({
  name: DB_TABLES.USERS,
})
export default class UserEntity {
  @PrimaryGeneratedColumn()
  [USER_ENTITY_KEYS.ID]: number;

  @Column({
    type: 'enum',
    array: false,
    enum: Object.values(USER_STATUSES),
    default: USER_STATUSES.ACTIVE,
  })
  [USER_ENTITY_KEYS.STATUS]: USER_STATUSES;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  [USER_ENTITY_KEYS.USERNAME]: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  [USER_ENTITY_KEYS.EMAIL]: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  [USER_ENTITY_KEYS.PASSWORD]: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  [USER_ENTITY_KEYS.REFRESH_TOKEN]?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  [USER_ENTITY_KEYS.FIRST_NAME]: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  [USER_ENTITY_KEYS.LAST_NAME]: string;

  @CreateDateColumn()
  [USER_ENTITY_KEYS.CREATED_AT]: Date;

  @UpdateDateColumn()
  [USER_ENTITY_KEYS.UPDATED_AT]: Date;

  @DeleteDateColumn()
  [USER_ENTITY_KEYS.DELETED_AT]: Date;

  @BeforeInsert()
  async hashPassword() {
    this[USER_ENTITY_KEYS.PASSWORD] = hashSync(this.password, 10);
  }
}

export { USER_STATUSES };
