import { Payment } from '../models/payment.model';

export interface ProcessPaymentPayload {
  orderId: string;
  amount: number;
  currency?: string;
  method: string;
}

export const processPayment = async (payload: ProcessPaymentPayload) => {
  const payment = await Payment.create({
    orderId: payload.orderId,
    amount: payload.amount,
    currency: payload.currency ?? 'USD',
    method: payload.method,
    status: 'completed',
    transactionId: `tx_${Date.now()}`,
  });

  return payment;
};

export const getPaymentByOrderId = async (orderId: string) => {
  return Payment.findOne({ where: { orderId } });
};
