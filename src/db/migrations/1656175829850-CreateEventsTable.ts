import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLES } from '../constants';
import {
  EVENT_FOREIGN_KEYS,
  EVENT_STATUSES,
} from '../../entities/event.entity';

export class CreateEventsTable1656175829850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLES.EVENTS,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'status',
            type: 'enum',
            isNullable: false,
            enum: Object.values(EVENT_STATUSES),
            default: `'${EVENT_STATUSES.ACTIVE}'`,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'house',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'holding_at',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'owner',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: EVENT_FOREIGN_KEYS.HOUSE,
            columnNames: ['house'],
            referencedTableName: DB_TABLES.HOUSES,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: EVENT_FOREIGN_KEYS.OWNER,
            columnNames: ['owner'],
            referencedTableName: DB_TABLES.USERS,
            referencedColumnNames: ['id'],
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
