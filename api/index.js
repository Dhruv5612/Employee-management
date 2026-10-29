import app from '../server/src/app.js';
import { connectDatabase } from '../server/src/config/database.js';
import { seedDatabase } from '../server/src/seed/seedData.js';

let isInitialized = false;

export default async function handler(req, res) {
  if (!isInitialized) {
    try {
      await connectDatabase();
      await seedDatabase();
      isInitialized = true;
    } catch (error) {
      console.error('[Vercel Serverless API] Initialization error:', error);
    }
  }

  return app(req, res);
}
