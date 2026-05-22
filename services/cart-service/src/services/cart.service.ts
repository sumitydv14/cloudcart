import { redisClient } from '../config/redis';

export interface CartItem {
  productId: string;
  name?: string;
  quantity: number;
  price: number;
}

export interface CartPayload {
  userId: string;
  items: CartItem[];
}

export const getCart = async (userId: string): Promise<CartPayload> => {
  const cartData = await redisClient.get(`cart:${userId}`);

  if (!cartData) {
    return { userId, items: [] };
  }

  return JSON.parse(cartData) as CartPayload;
};

export const saveCart = async (cart: CartPayload): Promise<CartPayload> => {
  await redisClient.set(`cart:${cart.userId}`, JSON.stringify(cart));
  return cart;
};

export const addCartItem = async (userId: string, item: CartItem) => {
  const cart = await getCart(userId);
  const existing = cart.items.find((entry) => entry.productId === item.productId);

  if (existing) {
    existing.quantity += item.quantity;
    existing.price = item.price;
  } else {
    cart.items.push(item);
  }

  return saveCart(cart);
};

export const updateCartItem = async (userId: string, productId: string, quantity: number) => {
  const cart = await getCart(userId);
  const item = cart.items.find((entry) => entry.productId === productId);

  if (!item) {
    return null;
  }

  item.quantity = quantity;
  return saveCart(cart);
};

export const removeCartItem = async (userId: string, productId: string) => {
  const cart = await getCart(userId);
  cart.items = cart.items.filter((entry) => entry.productId !== productId);
  return saveCart(cart);
};

export const clearCart = async (userId: string) => {
  await redisClient.del(`cart:${userId}`);
  return { userId, items: [] };
};
