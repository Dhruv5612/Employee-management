import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from '../server/src/app.js';
import mongoose from 'mongoose';
import { connectDatabase } from '../server/src/config/database.js';
import { seedDatabase } from '../server/src/seed/seedData.js';

let isSeeded = false;

export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
      if (!isSeeded) {
        await seedDatabase().catch((err) => console.error('[Seed error]:', err));
        isSeeded = true;
      }
    } catch (error) {
      console.error('[Vercel Serverless API] Database connection error:', error.message);
    }
  }

  return app(req, res);
}

