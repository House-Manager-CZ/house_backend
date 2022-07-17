import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DB_TABLES } from '../db/constants';
import HouseEntity, { HOUSE_ENTITY_KEYS } from './house.entity';
import UserEntity from './user.entity';
import { Exclude } from 'class-transformer';

export enum HOUSE_MEMBER_FOREIGN_KEYS {
  HOUSE = 'fk_house_users_houses',
  USER = 'fk_house_users_users',
}

export enum HOUSE_MEMBER_ENTITY_KEYS {
  HOUSE_ID = 'house_id',
  USER_ID = 'user_id',
  HOUSE = 'house',
  USER = 'user',
}

@Entity({
  name: DB_TABLES.HOUSE_USERS,
})
export default class HouseMemberEntity {
  @PrimaryColumn({
    name: HOUSE_MEMBER_ENTITY_KEYS.HOUSE_ID,
    type: 'uuid',
  })
  @Exclude()
  [HOUSE_MEMBER_ENTITY_KEYS.HOUSE_ID]: string;

  @PrimaryColumn({
    name: HOUSE_MEMBER_ENTITY_KEYS.USER_ID,
    type: 'int',
  })
  @Exclude()
  [HOUSE_MEMBER_ENTITY_KEYS.USER_ID]: number;

  @ManyToOne(() => HouseEntity, (house) => house[HOUSE_ENTITY_KEYS.MEMBERS])
  @JoinColumn({
    name: HOUSE_MEMBER_ENTITY_KEYS.HOUSE_ID,
  })
  [HOUSE_MEMBER_ENTITY_KEYS.HOUSE]: HouseEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: HOUSE_MEMBER_ENTITY_KEYS.USER_ID,
  })
  [HOUSE_MEMBER_ENTITY_KEYS.USER]: UserEntity;
}
