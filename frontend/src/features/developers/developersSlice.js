// src/features/developers/developersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_DEVELOPER_URL = 'http://localhost:5004/api/developers';

export const fetchDevelopers = createAsyncThunk('developers/fetchDevelopers', async () => {
  const response = await axios.get(API_DEVELOPER_URL);
  return response.data;
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
        state.error = action.error.message;
      });
  },
});

export default developersSlice.reducer;
