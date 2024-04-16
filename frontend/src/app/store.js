// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from '../features/games/gamesSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    wishlist: wishlistReducer,
  },
});
