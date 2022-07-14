import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { DB_TABLES } from '../constants';
import { USER_ENTITY_KEYS } from '../../entities/user.entity';

export class UpdateUserTable1657755500678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(DB_TABLES.USERS, [
      new TableColumn({
        name: USER_ENTITY_KEYS.USERNAME,
        type: 'varchar',
        isNullable: true,
        isUnique: true,
      }),
      new TableColumn({
        name: USER_ENTITY_KEYS.SEARCH_KEY,
        type: 'varchar',
        length: '4',
        isNullable: false,
        default: 'int2(random() * 10000)',
      }),
      new TableColumn({
        name: USER_ENTITY_KEYS.FIRST_NAME,
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: USER_ENTITY_KEYS.LAST_NAME,
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(DB_TABLES.USERS, [
      USER_ENTITY_KEYS.SEARCH_KEY,
      USER_ENTITY_KEYS.USERNAME,
      USER_ENTITY_KEYS.FIRST_NAME,
      USER_ENTITY_KEYS.LAST_NAME,
    ]);
  }
}
