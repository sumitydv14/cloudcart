import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import { createLogger } from './logger/index.js';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const logger = createLogger('api-gateway');
const app = express();
const port = Number(process.env.PORT ?? 8080);

const serviceUrls = {
  auth: process.env.AUTH_SERVICE_URL ?? 'http://auth-service:4000',
  products: process.env.PRODUCT_SERVICE_URL ?? 'http://product-service:4001',
  cart: process.env.CART_SERVICE_URL ?? 'http://cart-service:4002',
  orders: process.env.ORDER_SERVICE_URL ?? 'http://order-service:4003',
  payments: process.env.PAYMENT_SERVICE_URL ?? 'http://payment-service:4004',
};

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.use(
  '/api/v1/auth',
  createProxyMiddleware({
    target: serviceUrls.auth,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/auth': '/api/v1/auth' },
  })
);

app.use(
  '/api/v1/products',
  createProxyMiddleware({
    target: serviceUrls.products,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/products': '/products' },
  })
);

app.use(
  '/api/v1/cart',
  createProxyMiddleware({
    target: serviceUrls.cart,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/cart': '/cart' },
  })
);

app.use(
  '/api/v1/orders',
  createProxyMiddleware({
    target: serviceUrls.orders,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/orders': '/orders' },
  })
);

app.use(
  '/api/v1/payments',
  createProxyMiddleware({
    target: serviceUrls.payments,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/payments': '/payments' },
  })
);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ err }, 'Gateway error');
  res.status(500).json({ message: 'Gateway internal error' });
});

app.listen(port, () => {
  logger.info(`API Gateway listening on port ${port}`);
});
