import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_DEVELOPER_URL = 'http://localhost:5004/api/developers';

export const fetchDevelopers = createAsyncThunk('developers/fetchDevelopers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_DEVELOPER_URL);
    return response.data;
  } catch (error) {
    if (!error.response) {
      // It's a network error or something else where the response is not available
      console.error("Network error or no response:", error.message);
      return rejectWithValue('Network error or no response from server');
    } else {
      // Log specific server-side issues
      console.error('Server error on fetchDevelopers:', {
        status: error.response.status,
        data: error.response.data,
      });
      return rejectWithValue(error.response.data);
    }
  }
});

const developersSlice = createSlice({
  name: 'developers',
  initialState: {
    developers: [],
    status: 'idle',
    error: null,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDevelopers.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchDevelopers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.developers = action.payload;
      })
      .addCase(fetchDevelopers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unknown error occurred';
        console.error("Error fetching developers:", action.error.message || action.payload);
      });
  },
});

export default developersSlice.reducer;
