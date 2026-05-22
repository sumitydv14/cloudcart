import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import pinoHttp from 'pino-http';
import authRouter from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { config } from './config';

const app = express();
const logger = pinoHttp({ logger: config.logger });

app.use(logger);
app.use(helmet());
app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use('/api/v1/auth', authRouter);
app.get('/', (_, res) => {
  res.json({
    message: 'Auth Service Running',
  });
});
app.use(errorHandler);

async function start() {
  await mongoose.connect(config.mongoUri);
  app.listen(config.port, () => {
    config.logger.info(`Auth Service listening on port ${config.port}`);
  });
}

start().catch(error => {
  config.logger.error({ err: error }, 'Failed to start Auth Service');
  process.exit(1);
});
