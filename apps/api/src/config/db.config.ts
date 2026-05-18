import mongoose from "mongoose";

/**
 * Connects to MongoDB using the URI from environment variables.
 * Exits the process if the connection fails.
 */
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      "mongodb://nalinrox125_db_user:jBNqxv9sMfORflEq@ac-a9utmhm-shard-00-00.skquzj7.mongodb.net:27017,ac-a9utmhm-shard-00-01.skquzj7.mongodb.net:27017,ac-a9utmhm-shard-00-02.skquzj7.mongodb.net:27017/EarthBound?ssl=true&authSource=admin&replicaSet=atlas-vvzyi5-shard-0";

    const conn = await mongoose.connect(mongoUri);

    console.log(`[database]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[database]: Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
