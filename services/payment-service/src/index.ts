import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes';
import { connectWithRetry } from './config/database';
import { createLogger } from './logger';

dotenv.config();

const logger = createLogger('payment-service');
const app = express();
const port = Number(process.env.PORT ?? 4004);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
  })
);
app.use(
  pinoHttp({
    logger,
  })
);

app.use('/payments', paymentRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err, 'Unhandled payment service error');
  res.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  try {
    // await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    await connectWithRetry();
    logger.info({ port }, 'Payment service connected to database');
    app.listen(port, () => {
      logger.info(`Payment service listening on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start payment service');
    // process.exit(1);
  }
};

start();
