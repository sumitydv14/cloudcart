import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

export const createOrder = async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json(order);
};

export const getOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const orders = await orderService.getOrdersByUser(userId);
  res.json(orders);
};

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await orderService.getOrderById(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
};
