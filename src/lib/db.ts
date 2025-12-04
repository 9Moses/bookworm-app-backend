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

export const connectDB = async ()=>{
    try {
         const conn =  await mongoose.connect(config.MONGO_URL as string);
        console.log("Database connected");
        console.log(`Connected to MongoDB:${conn.connection.host}`);
    } catch (error) {
         console.error("Error connecting to MongoDB:", error);
         process.exit(1);
    }
}