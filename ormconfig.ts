import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: false,
  synchronize: false,
  name: 'default',
  entities: [__dirname + '/src/entities/**.entity{.ts,.js}'],
  migrations: [__dirname + '/src/db/migrations/**/*{.ts,.js}'],
  subscribers: [__dirname + '/src/db/subscriber/**/*{.ts,.js}'],
});
