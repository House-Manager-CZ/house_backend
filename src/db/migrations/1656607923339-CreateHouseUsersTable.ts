import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLES } from '../constants';
import { HOUSE_ENTITY_KEYS } from '../../entities/house.entity';

export class CreateHouseUsersTable1656607923339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLES.HOUSE_USERS,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'house_id',
            type: 'uuid',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'fk_house_users_houses',
            referencedTableName: DB_TABLES.HOUSES,
            referencedColumnNames: [HOUSE_ENTITY_KEYS.ID],
            columnNames: ['house_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'fk_house_users_users',
            referencedTableName: DB_TABLES.USERS,
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
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
