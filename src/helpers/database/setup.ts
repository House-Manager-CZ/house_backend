import { connectionSource } from '../../../ormconfig';
import UserEntity from '../../entities/user.entity';
import { hashSync } from 'bcrypt';

const retriesCount = process.env.NODE_ENV === 'test' ? 0 : 50;

export const runMigrations = async () => {
  console.log(`Migrating database...`);
  await connectionSource.runMigrations();
  console.log('Migrated database.');
};

export const insertAdminUser = async () => {
  const adminUser = await connectionSource.getRepository(UserEntity).findOne({
    where: {
      email: process.env.ADMIN_EMAIL,
    },
  });

  if (adminUser) return;

  if (!process.env.ADMIN_EMAIL && !process.env.ADMIN_PASSWORD)
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');

  console.log(`Inserting admin user...`);
  await connectionSource.getRepository(UserEntity).insert({
    email: process.env.ADMIN_EMAIL,
    password: hashSync(process.env.ADMIN_PASSWORD, 10),
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