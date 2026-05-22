import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import cartRoutes from './routes/cart.routes';
import { redisClient } from './config/redis';
import { createLogger } from './logger';

dotenv.config();

const logger = createLogger('cart-service');
const app = express();
const port = Number(process.env.PORT ?? 4002);

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

app.use('/cart', cartRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err, 'Unhandled cart service error');
  res.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  try {
    await redisClient.ping();
    logger.info({ port }, 'Cart service connected to Redis');
    app.listen(port, () => {
      logger.info(`Cart service listening on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start cart service');
    process.exit(1);
  }
};

start();
