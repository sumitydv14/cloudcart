import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import { connectWithRetry } from './config/database';
import { createLogger } from './logger';

dotenv.config();

const logger = createLogger('product-service');
const app = express();
const port = Number(process.env.PORT ?? 4001);

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

app.use('/products', productRoutes);
app.get('/health', (_, res) => {
res.status(200).json({
status: 'OK',
service: 'product-service',
});
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err, 'Unhandled error');
  res.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  try {
    // await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    logger.info({ port }, 'Product service connected to database');
    await connectWithRetry();
    app.listen(port, () => {
      logger.info(`Product service listening on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start product service');
    // process.exit(1);
  }
};

start();

