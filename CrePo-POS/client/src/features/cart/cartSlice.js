import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existItem = state.cartItems.find(x => x.product === newItem.product && x.unitName === newItem.unitName);

      if (existItem) {
        state.cartItems = state.cartItems.map(x =>
          x.product === existItem.product && x.unitName === existItem.unitName ? { ...x, qty: x.qty + newItem.qty } : x
        );
      } else {
        state.cartItems = [...state.cartItems, newItem];
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateCartQuantity: (state, action) => {
        const { cartId, qty } = action.payload;
        state.cartItems = state.cartItems.map(x => x.cartId === cartId ? {...x, qty: qty} : x);
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x.cartId !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
        state.cartItems = [];
        localStorage.removeItem('cartItems');
    }
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;