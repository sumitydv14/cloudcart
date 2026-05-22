import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';

export const createPayment = async (req: Request, res: Response) => {
  const payment = await paymentService.processPayment(req.body);
  res.status(201).json(payment);
};

export const getPayment = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const payment = await paymentService.getPaymentByOrderId(orderId);

  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  res.json(payment);
};
