import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  subtotal: number;
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.subtotal = action.payload.reduce((total, item) => total + item.price * item.quantity, 0);
      state.status = 'succeeded';
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(item => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.productId !== action.payload);
      state.subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { setCartItems, addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
