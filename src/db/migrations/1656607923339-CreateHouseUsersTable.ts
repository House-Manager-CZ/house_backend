import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLES } from '../constants';
import { HOUSE_ENTITY_KEYS } from '../../entities/house.entity';
import { USER_ENTITY_KEYS } from '../../entities/user.entity';
import {
  HOUSE_MEMBER_ENTITY_KEYS,
  HOUSE_MEMBER_FOREIGN_KEYS,
} from '../../entities/houseMember.entity';

export class CreateHouseUsersTable1656607923339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLES.HOUSE_USERS,
        columns: [
          {
            name: HOUSE_MEMBER_ENTITY_KEYS.HOUSE_ID,
            type: 'uuid',
            unsigned: true,
            isNullable: false,
            isPrimary: true,
          },
          {
            name: HOUSE_MEMBER_ENTITY_KEYS.USER_ID,
            type: 'int',
            unsigned: true,
            isNullable: false,
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            name: HOUSE_MEMBER_FOREIGN_KEYS.HOUSE,
            referencedTableName: DB_TABLES.HOUSES,
            referencedColumnNames: [HOUSE_ENTITY_KEYS.ID],
            columnNames: [HOUSE_MEMBER_ENTITY_KEYS.HOUSE_ID],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: HOUSE_MEMBER_FOREIGN_KEYS.USER,
            referencedTableName: DB_TABLES.USERS,
            referencedColumnNames: [USER_ENTITY_KEYS.ID],
            columnNames: [HOUSE_MEMBER_ENTITY_KEYS.USER_ID],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DB_TABLES.HOUSE_USERS, true, true, true);
  }
}
