import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from '../auth/authSlice';

const API_WISHLIST_URL = 'http://localhost:5004/api/Wishlists';
const API_GAME_WISHLISTS_URL = 'http://localhost:5004/api/GameWishlists';


export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (customerId, { rejectWithValue }) => {
  try {
    const wishlistIdResp = await axios.get(`${API_WISHLIST_URL}/Customer/${customerId}/WishlistId`);
    const wishlistId = wishlistIdResp.data;
    const response = await axios.get(`${API_GAME_WISHLISTS_URL}/Wishlist/${wishlistId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch wishlist:", {
      customerId,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return rejectWithValue(error.response?.data || 'Failed to fetch wishlist');
  }
});

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ customerId, gameId }, { rejectWithValue }) => {
    try {
      // Fetch the WishlistId associated with the customerId from the backend
      const wishlistIdResponse = await axios.get(`${API_WISHLIST_URL}/Customer/${customerId}/WishlistId`);
      const wishlistId = wishlistIdResponse.data;

      // Send the request with the correct WishlistId
      const { data } = await axios.post(`${API_GAME_WISHLISTS_URL}`, { WishlistId: wishlistId, GameId: gameId });

      return data;
    } catch (error) {
      console.error("Failed to add to wishlist:", error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (gameWishlistId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_GAME_WISHLISTS_URL}/${gameWishlistId}`);
    return gameWishlistId; // Return ID to remove from state
  } catch (error) {
    console.error("Failed to remove game from wishlist:", {
      gameWishlistId,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return rejectWithValue(error.response?.data || 'Failed to remove game from wishlist');
  }
});

export const clearWishlist = createAsyncThunk('wishlist/clearWishlist', async (customerId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_GAME_WISHLISTS_URL}/Clear/${customerId}`);
    return customerId; // Use customerId to confirm clearing in the state update
  } catch (error) {
    console.error("Failed to clear wishlist:", {
      customerId,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return rejectWithValue(error.response?.data || 'Failed to clear wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.gameWishlistId !== action.payload);
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = []; // Clears the wishlist
      })
      .addCase(logout, (state) => {
        state.items = []; // Also clear the wishlist on logout
        state.status = 'idle';
      });
  }
});

export default wishlistSlice.reducer;