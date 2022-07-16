import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { DB_TABLES } from '../constants';
import UserEntity, { USER_ENTITY_KEYS } from '../../entities/user.entity';

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
        default: 'substring(random()::text, 3, 4)',
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

    await queryRunner.manager
      .createQueryBuilder()
      .update<UserEntity>(UserEntity)
      .set({
        [USER_ENTITY_KEYS.USERNAME]: () =>
          `split_part(${USER_ENTITY_KEYS.EMAIL}, '@', 1)`,
      })
      .execute();

    await queryRunner.addColumn(
      DB_TABLES.USERS,
      new TableColumn({
        name: USER_ENTITY_KEYS.SEARCH_NAME,
        type: 'varchar',
        generatedType: 'STORED',
        generatedIdentity: 'ALWAYS',
        asExpression: `${USER_ENTITY_KEYS.USERNAME} || '#' || ${USER_ENTITY_KEYS.SEARCH_KEY}`,
      }),
    );

    await queryRunner.changeColumn(
      DB_TABLES.USERS,
      USER_ENTITY_KEYS.USERNAME,
      new TableColumn({
        name: USER_ENTITY_KEYS.USERNAME,
        type: 'varchar',
        isNullable: false,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(DB_TABLES.USERS, [
      USER_ENTITY_KEYS.SEARCH_NAME,
      USER_ENTITY_KEYS.SEARCH_KEY,
      USER_ENTITY_KEYS.USERNAME,
      USER_ENTITY_KEYS.FIRST_NAME,
      USER_ENTITY_KEYS.LAST_NAME,
    ]);
  }
}
