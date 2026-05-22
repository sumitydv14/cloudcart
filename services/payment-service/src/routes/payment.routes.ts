import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.post('/', paymentController.createPayment);
router.get('/:orderId', paymentController.getPayment);

export default router;
