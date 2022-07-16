import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLES } from '../constants';
import {
  HOUSE_ENTITY_KEYS,
  HOUSE_FOREIGN_KEYS,
  HOUSE_STATUSES,
} from '../../entities/house.entity';
import { USER_ENTITY_KEYS } from '../../entities/user.entity';

export class CreateHousesTable1655851932423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLES.HOUSES,
        columns: [
          {
            name: HOUSE_ENTITY_KEYS.ID,
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: HOUSE_ENTITY_KEYS.STATUS,
            type: 'enum',
            enum: Object.values(HOUSE_STATUSES),
            default: `'${HOUSE_STATUSES.ACTIVE}'`,
          },
          {
            name: HOUSE_ENTITY_KEYS.NAME,
            type: 'varchar',
            isNullable: false,
          },
          {
            name: HOUSE_ENTITY_KEYS.LOCATION,
            type: 'geography',
            isNullable: true,
          },
          {
            name: HOUSE_ENTITY_KEYS.OWNER,
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: HOUSE_ENTITY_KEYS.CREATED_AT,
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: HOUSE_ENTITY_KEYS.UPDATED_AT,
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: HOUSE_ENTITY_KEYS.DELETED_AT,
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: HOUSE_FOREIGN_KEYS.OWNER,
            columnNames: [HOUSE_ENTITY_KEYS.OWNER],
            referencedTableName: DB_TABLES.USERS,
            referencedColumnNames: [USER_ENTITY_KEYS.ID],
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DB_TABLES.HOUSES, true, true, true);
  }
}
