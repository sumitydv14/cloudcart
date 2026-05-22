import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const cart = await cartService.getCart(userId);
  res.json(cart);
};

export const addItem = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const item = req.body;
  const cart = await cartService.addCartItem(userId, item);
  res.status(201).json(cart);
};

export const updateItem = async (req: Request, res: Response) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(userId, productId, quantity);

  if (!cart) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  res.json(cart);
};

export const removeItem = async (req: Request, res: Response) => {
  const { userId, productId } = req.params;
  const cart = await cartService.removeCartItem(userId, productId);
  res.json(cart);
};

export const clearCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const cart = await cartService.clearCart(userId);
  res.json(cart);
};
