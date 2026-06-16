import mongoose from 'mongoose';

let isConnected = false;

/**
 * Singleton database connection wrapper for MongoDB Atlas.
 * Fails fast if MONGODB_URI is not specified.
 */
export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('[database] FATAL ERROR: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  if (isConnected) {
    console.log('[database] Using active database connection instance (singleton).');
    return;
  }

  try {
    console.log('[database] Connecting to MongoDB Atlas...');
    const db = await mongoose.connect(mongoUri, {
      autoIndex: true, // Build defined indexes on startup
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('[database] Connected to MongoDB Atlas successfully.');
  } catch (error) {
    console.error('[database] FATAL ERROR: MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown handlers to close connection on process termination
const handleGracefulShutdown = async (signal: string) => {
  console.log(`[database] Received ${signal}. Closing Mongoose connection...`);
  try {
    await mongoose.connection.close();
    console.log('[database] Mongoose connection closed gracefully.');
    process.exit(0);
  } catch (error) {
    console.error('[database] Error during Mongoose connection closure:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
export default connectDatabase;
