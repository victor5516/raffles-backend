import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from 'body-parser';
import logger from "./utils/logger";
import path from "path";
import fs from 'fs';
import morganMiddleware from "./middleware/morgan.middleware"
import { debugRequestMiddleware } from "./middleware/debug.middleware";
import { errorConverter, errorHandler, notFoundHandler } from "./middleware/error.middleware";
import router from "./routes";

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Logging and debugging middlewares
app.use(morganMiddleware);
app.use(debugRequestMiddleware);

// Main API route
app.use('/api/v1', router);

// Middleware for not found routes
app.use(notFoundHandler);

// Error handling middleware
app.use(errorConverter);
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('error not handled:');
  logger.error(error);

  // Close server in case of critical error
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('promise not handled:');
  logger.error(error);
})

app.listen(PORT, () => {
  logger.info(`==================================`);
  logger.info(`🚀 Server running on port ${PORT} 🚀`);
  logger.info(`🌎 Environment: ${process.env.NODE_ENV ?? 'development'}`)
  logger.info(`🔍 Debug: ${process.env.DEBUG === 'true' ? 'Enabled' : 'Disabled'}`);
  logger.info(`==================================`);
})
