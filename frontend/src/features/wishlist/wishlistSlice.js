import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from '../auth/authSlice';

// wishlistSlice holds all state related to wishlists and gamewishlists
// Thunks handle asynchronous data flow like API calls, and Axios sends these HTTP API requests to backend through the thunks

// Backend urls into variables
const API_WISHLIST_URL = 'http://localhost:5004/api/Wishlists';
const API_GAME_WISHLISTS_URL = 'http://localhost:5004/api/GameWishlists';

// Thunk to get a wishlist
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

// Thunk to add a game to a wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ customerId, gameId }, { rejectWithValue }) => {
    try {
      const wishlistIdResponse = await axios.get(`${API_WISHLIST_URL}/Customer/${customerId}/WishlistId`);
      const wishlistId = wishlistIdResponse.data;

      const { data } = await axios.post(`${API_GAME_WISHLISTS_URL}`, { WishlistId: wishlistId, GameId: gameId });

      return data;
    } catch (error) {
      console.error("Failed to add to wishlist:", error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to remove a game from a wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (gameWishlistId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_GAME_WISHLISTS_URL}/${gameWishlistId}`);
    return gameWishlistId;
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

// Thunk to remove all games from a wishlist
export const clearWishlist = createAsyncThunk('wishlist/clearWishlist', async (customerId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_GAME_WISHLISTS_URL}/Clear/${customerId}`);
    return customerId;
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

// Slice definition (integrating extra reducers)
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  // Handle async actions created by the thunks to update state
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
        state.items = [];
      })
      .addCase(logout, (state) => {
        state.items = [];
        state.status = 'idle';
      });
  }
});

// Exporting thunks to be used outside the slice
export default wishlistSlice.reducer;