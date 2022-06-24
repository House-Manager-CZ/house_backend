import { setupDatabase } from '../database/setup';

const setupApp = async () => {
  await setupDatabase();
};

setupApp();
