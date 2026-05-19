import mongoose from "mongoose";

/**
 * Connects to MongoDB using the URI from environment variables.
 * Exits the process if the connection fails.
 */
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/chillebazzar";

    const conn = await mongoose.connect(mongoUri);

    console.log(`[database]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[database]: Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
