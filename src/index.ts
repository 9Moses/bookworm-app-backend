import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import config from "./config";

//lib
import { connectDB } from "./lib/db";
import limiter from "./lib/express-rate-limiter";

//types
import type { CorsOptions } from "cors";

//routers
import authRouter from "./routes/v1/auth.routes";
import bookRouter from "./routes/v1/bookapp.routes";

const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      config.WHITELISTED_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Erros: ${origin} is not allowed by CORS`),
        false
      );
    }
    console.log(`CORS Erros: ${origin} is not allowed by CORS`);
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Enable resposne compression to reduce a payload size and improve performance
app.use(
  compression({
    threshold: 1024, //only compress responses larger than 1kb
  })
);

//Use Helmet to enhance security by setting various HTTP headers
app.use(helmet());

//Apply rate limiting
app.use(limiter);

(async () => {
  try {
    console.log("Server is starting...");

    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/books", bookRouter);

    app.listen(config.PORT, () => {
      console.log(`Server is running on port http://localhost:${config.PORT}`);
      connectDB();
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

//server shutdown gracefully
const handleServerShutdown = async() => {
    try{
        console.log('Server SHUTDOWN')
        process.exit(0);
    }catch(error){
        console.error("Error During Server Shutdown:", error);
        process.exit(1);
    }
}

//Listens for termination signals and gracefully shuts down the server
process.on("SIGINT", handleServerShutdown);
process.on("SIGTERM", handleServerShutdown);