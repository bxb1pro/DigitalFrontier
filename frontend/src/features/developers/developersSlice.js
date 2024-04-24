import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// developersSlice holds all state related to developers
// Thunks handle asynchronous data flow like API calls, and Axios sends these HTTP API requests to backend through the thunks

// Backend url into variable
const API_DEVELOPER_URL = 'http://localhost:5004/api/developers';

// Thunk to fetch developers
export const fetchDevelopers = createAsyncThunk('developers/fetchDevelopers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_DEVELOPER_URL);
    return response.data;
  } catch (error) {
    if (!error.response) {
      console.error("Network error or no response:", error.message);
      return rejectWithValue('Network error or no response from server');
    } else {
      console.error('Server error on fetchDevelopers:', {
        status: error.response.status,
        data: error.response.data,
      });
      return rejectWithValue(error.response.data);
    }
  }
});

// Slice definition (integrating extra reducers)
const developersSlice = createSlice({
  name: 'developers',
  initialState: {
    developers: [],
    status: 'idle',
    error: null,
  },
  // Handle async actions created by the thunks to update state
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

// Exporting thunks to be used outside the slice
export default developersSlice.reducer;
