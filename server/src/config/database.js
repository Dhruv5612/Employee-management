import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

let mongoMemoryServer = null;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_management';

  try {
    // Attempt standard connection with 2 second timeout for local/Atlas
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB connected successfully to ${uri}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to external MongoDB (${error.message}).`);
    console.log('[Database] Initializing fallback in-memory MongoDB server for development...');

    try {
      const localDbDir = path.resolve(process.cwd(), 'node_modules/.cache/.mongomem');
      if (!fs.existsSync(localDbDir)) {
        fs.mkdirSync(localDbDir, { recursive: true });
      }

      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'employee_management',
          dbPath: localDbDir,
        },
      });
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] In-memory MongoDB connected successfully at ${memoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to start in-memory MongoDB fallback:', memErr);
      throw memErr;
    }
  }

  // Handle connection events
  mongoose.connection.on('error', (err) => {
    console.error('[Database] MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB disconnected');
  });
}

export async function closeDatabase() {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
