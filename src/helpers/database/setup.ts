import { connectionSource } from '../../../ormconfig';
import UserEntity, { USER_ENTITY_KEYS } from '../../entities/user.entity';
import { hashSync } from 'bcrypt';
import { checkAdminUser } from './validation';

const retriesCount = process.env.NODE_ENV === 'test' ? 0 : 50;

export const runMigrations = async () => {
  console.log(`Migrating database...`);
  await connectionSource.runMigrations();
  console.log('Migrated database.');
};

export const insertAdminUser = async () => {
  if (
    !process.env.ADMIN_EMAIL ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.ADMIN_USERNAME
  )
    throw new Error(
      'ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set',
    );

  const adminUser = await connectionSource.getRepository(UserEntity).findOne({
    where: {
      [USER_ENTITY_KEYS.EMAIL]: process.env.ADMIN_EMAIL,
    },
  });

  if (adminUser) {
    if (checkAdminUser(adminUser)) return;
    else {
      console.log(`Updating admin user...`);
      await connectionSource.getRepository(UserEntity).update(adminUser.id, {
        [USER_ENTITY_KEYS.USERNAME]: process.env.ADMIN_USERNAME,
        [USER_ENTITY_KEYS.EMAIL]: process.env.ADMIN_EMAIL,
        [USER_ENTITY_KEYS.PASSWORD]: hashSync(process.env.ADMIN_PASSWORD, 10),
      });
      console.log('Updated admin user.');
      return;
    }
  }

  console.log(`Inserting admin user...`);
  await connectionSource.getRepository(UserEntity).insert({
    [USER_ENTITY_KEYS.USERNAME]: process.env.ADMIN_USERNAME,
    [USER_ENTITY_KEYS.EMAIL]: process.env.ADMIN_EMAIL,
    [USER_ENTITY_KEYS.PASSWORD]: hashSync(process.env.ADMIN_PASSWORD, 10),
  });
  console.log('Inserted admin user.');
};

export const setupDatabase = async (retries = retriesCount) => {
  if (retries === 0) process.exit(1);

  try {
    console.log(`Connecting to database... [${retriesCount - retries}]`);
    await connectionSource.initialize();
    console.log('Connected to database.');

    await runMigrations();
    await insertAdminUser().catch((err) => {
      console.error(err);
      process.exit(1);
    });

    console.log(`Closing database connection...`);
    await connectionSource.destroy();
    console.log('Database connection closed.');

    process.exit();
  } catch (error) {
    console.error(error);
    setTimeout(() => setupDatabase(retries - 1), 2000);
  }
};
