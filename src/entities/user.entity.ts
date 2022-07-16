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
import { ApiProperty } from '@nestjs/swagger';

enum USER_STATUSES {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export enum USER_ENTITY_KEYS {
  ID = 'id',
  STATUS = 'status',
  SEARCH_KEY = 'search_key',
  SEARCH_NAME = 'search_name',
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
  @ApiProperty({
    name: USER_ENTITY_KEYS.ID,
    description: 'User ID',
    type: 'number',
    required: true,
  })
  @PrimaryGeneratedColumn()
  [USER_ENTITY_KEYS.ID]: number;

  @ApiProperty({
    name: USER_ENTITY_KEYS.STATUS,
    description: 'User status',
    enum: USER_STATUSES,
    default: USER_STATUSES.ACTIVE,
    required: true,
  })
  @Column({
    type: 'enum',
    array: false,
    enum: Object.values(USER_STATUSES),
    default: USER_STATUSES.ACTIVE,
  })
  [USER_ENTITY_KEYS.STATUS]: USER_STATUSES;

  @ApiProperty({
    name: USER_ENTITY_KEYS.SEARCH_KEY,
    description: 'Search key',
    type: 'string',
    required: true,
    example: '1234',
    maxLength: 4,
    minLength: 4,
  })
  @Column({
    type: 'varchar',
    length: '4',
    nullable: false,
    default: 'substring(random()::text, 3, 4)',
  })
  [USER_ENTITY_KEYS.SEARCH_KEY]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.SEARCH_NAME,
    description: 'Search name',
    type: 'string',
    required: true,
    pattern: `^(${USER_ENTITY_KEYS.USERNAME})#(${USER_ENTITY_KEYS.SEARCH_KEY})$`,
  })
  @Column({
    type: 'varchar',
    generatedType: 'STORED',
    generatedIdentity: 'ALWAYS',
    asExpression: `${USER_ENTITY_KEYS.USERNAME} || '#' || ${USER_ENTITY_KEYS.SEARCH_KEY}`,
  })
  [USER_ENTITY_KEYS.SEARCH_NAME]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.USERNAME,
    description: 'Username',
    type: 'string',
    required: true,
  })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  [USER_ENTITY_KEYS.USERNAME]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.EMAIL,
    description: 'Email',
    type: 'string',
    required: true,
  })
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

  @ApiProperty({
    name: USER_ENTITY_KEYS.FIRST_NAME,
    description: 'First name',
    type: 'string',
    required: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  [USER_ENTITY_KEYS.FIRST_NAME]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.LAST_NAME,
    description: 'Last name',
    type: 'string',
    required: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  [USER_ENTITY_KEYS.LAST_NAME]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.CREATED_AT,
    description: 'Created at',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @CreateDateColumn()
  [USER_ENTITY_KEYS.CREATED_AT]: Date;

  @ApiProperty({
    name: USER_ENTITY_KEYS.UPDATED_AT,
    description: 'Updated at',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @UpdateDateColumn()
  [USER_ENTITY_KEYS.UPDATED_AT]: Date;

  @ApiProperty({
    name: USER_ENTITY_KEYS.DELETED_AT,
    description: 'Deleted at',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @DeleteDateColumn()
  [USER_ENTITY_KEYS.DELETED_AT]: Date;

  @BeforeInsert()
  async hashPassword() {
    this[USER_ENTITY_KEYS.PASSWORD] = hashSync(this.password, 10);
  }
}

export { USER_STATUSES };
