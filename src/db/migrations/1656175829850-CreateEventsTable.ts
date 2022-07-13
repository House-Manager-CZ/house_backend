import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLES } from '../constants';
import {
  EVENT_ENTITY_KEYS,
  EVENT_FOREIGN_KEYS,
  EVENT_STATUSES,
} from '../../entities/event.entity';
import { HOUSE_ENTITY_KEYS } from '../../entities/house.entity';
import { USER_ENTITY_KEYS } from '../../entities/user.entity';

export class CreateEventsTable1656175829850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLES.EVENTS,
        columns: [
          {
            name: EVENT_ENTITY_KEYS.ID,
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: EVENT_ENTITY_KEYS.STATUS,
            type: 'enum',
            isNullable: false,
            enum: Object.values(EVENT_STATUSES),
            default: `'${EVENT_STATUSES.ACTIVE}'`,
          },
          {
            name: EVENT_ENTITY_KEYS.NAME,
            type: 'varchar',
            isNullable: false,
          },
          {
            name: EVENT_ENTITY_KEYS.HOUSE,
            type: 'uuid',
            isNullable: false,
          },
          {
            name: EVENT_ENTITY_KEYS.HOLDING_AT,
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: EVENT_ENTITY_KEYS.OWNER,
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: EVENT_ENTITY_KEYS.CREATED_AT,
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: EVENT_ENTITY_KEYS.UPDATED_AT,
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: EVENT_ENTITY_KEYS.DELETED_AT,
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: EVENT_FOREIGN_KEYS.HOUSE,
            columnNames: [EVENT_ENTITY_KEYS.HOUSE],
            referencedTableName: DB_TABLES.HOUSES,
            referencedColumnNames: [HOUSE_ENTITY_KEYS.ID],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: EVENT_FOREIGN_KEYS.OWNER,
            columnNames: [EVENT_ENTITY_KEYS.OWNER],
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
    await queryRunner.dropTable(DB_TABLES.EVENTS, true, true, true);
  }
}
