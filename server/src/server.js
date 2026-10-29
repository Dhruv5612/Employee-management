import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { seedDatabase } from './seed/seedData.js';

async function startServer() {
  await connectDatabase();
  await seedDatabase();

  const port = Number(process.env.PORT || 5000);

  app.listen(port, () => {
    console.log(`===============================================`);
    console.log(`🚀 Employee Management API Server listening on port ${port}`);
    console.log(`📡 Base URL: http://localhost:${port}/api/v1`);
    console.log(`🏥 Health Check: http://localhost:${port}/health`);
    console.log(`===============================================`);
  });
}

startServer().catch((error) => {
  console.error('[Server] Fatal startup failure:', error);
  process.exit(1);
});
