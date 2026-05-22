import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';

const router = Router();

router.get('/:userId', cartController.getCart);
router.post('/:userId/items', cartController.addItem);
router.put('/:userId/items/:productId', cartController.updateItem);
router.delete('/:userId/items/:productId', cartController.removeItem);
router.post('/:userId/clear', cartController.clearCart);

export default router;
