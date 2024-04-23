import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from '../features/games/gamesSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import developersReducer from '../features/developers/developersSlice';
import authReducer from '../features/auth/authSlice';
import basketReducer from '../features/basket/basketSlice';
import transactionReducer from '../features/transactions/transactionSlice';

// Central configuration point for Redux store (holds complete state of application)

// Each reducer below manages relevant part of application's state
export const store = configureStore({
  reducer: {
    games: gamesReducer,
    wishlist: wishlistReducer,
    developers: developersReducer,
    auth: authReducer,
    basket: basketReducer,
    transactions: transactionReducer,
  },
});
