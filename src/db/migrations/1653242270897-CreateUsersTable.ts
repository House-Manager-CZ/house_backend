import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLES } from '../constants';
import { USER_STATUSES } from '../../entities/user.entity';

export class CreateUsersTable1653242270897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLES.USERS,
        columns: [
          {
            name: 'id',
            type: 'int',
            generationStrategy: 'increment',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(USER_STATUSES),
            default: `'${USER_STATUSES.ACTIVE}'`,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DB_TABLES.USERS, true, true, true);
  }
}
