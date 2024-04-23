import { createSlice } from '@reduxjs/toolkit';

// basketSlice holds all state related to baskets

// Function to get items in a basket (if existing)
const getInitialBasket = () => {
  try {
    const items = localStorage.getItem('basket');
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Failed to retrieve basket from local storage:', error);
    return [];
  }
};

const initialState = {
  items: getInitialBasket(),
};

// Slice definition (integrating reducers)
export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  // Synchronous actions, resolve immediately to update state
  reducers: {
    addToBasket: (state, action) => {
      state.items.push(action.payload);
      try {
        localStorage.setItem('basket', JSON.stringify(state.items));
      } catch (error) {
        console.error('Failed to add item to basket in local storage:', error);
      }
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        const newBasket = [...state.items];
        newBasket.splice(index, 1);
        state.items = newBasket;
        try {
          localStorage.setItem('basket', JSON.stringify(state.items));
        } catch (error) {
          console.error('Failed to remove item from basket in local storage:', error);
        }
      }
    },
    clearBasket: (state) => {
      state.items = [];
      try {
        localStorage.removeItem('basket');
      } catch (error) {
        console.error('Failed to clear basket in local storage:', error);
      }
    }
  },
});

// Exporting functions to be used outside the slice
export const { addToBasket, removeFromBasket, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;
