import { Order, OrderItem } from '../models/order.model';

export interface CreateOrderItemPayload {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  userId: string;
  currency?: string;
  items: CreateOrderItemPayload[];
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({
    userId: payload.userId,
    status: 'pending',
    total,
    currency: payload.currency ?? 'USD',
  });

  const orderItems = payload.items.map((item) => ({
    ...item,
    orderId: order.id,
  }));

  await OrderItem.bulkCreate(orderItems);
  return getOrderById(order.id);
};

export const getOrdersByUser = async (userId: string) => {
  return Order.findAll({
    where: { userId },
    include: [{ model: OrderItem, as: 'items' }],
    order: [['createdAt', 'DESC']],
  });
};

export const getOrderById = async (id: string) => {
  return Order.findByPk(id, {
    include: [{ model: OrderItem, as: 'items' }],
  });
};
