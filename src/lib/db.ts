import mongoose from "mongoose";
import config from "../config";
import type { ConnectOptions } from "mongoose";

//Client options

const clientOptions: ConnectOptions = {
    dbName: "bookify",
    appName: "Bookworm API",
    serverApi:{
        version: "1",
        strict: true,
        deprecationErrors: true
    }
};

export const connectDB = async (): Promise<void>=>{
    if(!config.MONGO_URL){
      throw new Error("MONGO_URL is missing in environment variables.");
    }

    try {
         const conn =  await mongoose.connect(config.MONGO_URL as string, clientOptions);
        console.log("Database connected",{
            uri: config.MONGO_URL,
            options: clientOptions
        });
        console.log(`Connected to MongoDB:${conn.connection.host}`);
    } catch (error) {
         console.error("Error connecting to MongoDB:", error);
         process.exit(1);
    }
}

export const disconnectDB = async (): Promise<void> => {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB",{
        uri: config.MONGO_URL,
        options: clientOptions
      });
    } catch (err) {
        if(err instanceof Error){
            console.error("Error disconnecting from MongoDB:", err.message);
        }
      console.error("Error disconnecting from MongoDB:", err);
    }
  };