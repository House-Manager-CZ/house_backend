import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLES } from '../constants';
import { USER_ENTITY_KEYS, USER_STATUSES } from '../../entities/user.entity';

export class CreateUsersTable1653242270897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLES.USERS,
        columns: [
          {
            name: USER_ENTITY_KEYS.ID,
            type: 'int',
            generationStrategy: 'increment',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
            isUnique: true,
          },
          {
            name: USER_ENTITY_KEYS.STATUS,
            type: 'enum',
            enum: Object.values(USER_STATUSES),
            default: `'${USER_STATUSES.ACTIVE}'`,
          },
          {
            name: USER_ENTITY_KEYS.EMAIL,
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: USER_ENTITY_KEYS.PASSWORD,
            type: 'varchar',
            isNullable: false,
          },
          {
            name: USER_ENTITY_KEYS.REFRESH_TOKEN,
            type: 'varchar',
            isNullable: true,
          },
          {
            name: USER_ENTITY_KEYS.CREATED_AT,
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: USER_ENTITY_KEYS.UPDATED_AT,
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: USER_ENTITY_KEYS.DELETED_AT,
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DB_TABLES.USERS, true, true, true);
  }
}
