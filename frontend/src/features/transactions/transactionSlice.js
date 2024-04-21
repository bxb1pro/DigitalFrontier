// src/features/transactions/transactionSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const postTransaction = createAsyncThunk(
  'transactions/postTransaction',
  async (transactionData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.post('http://localhost:5004/api/Transactions', transactionData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTransactionsByCustomer = createAsyncThunk(
    'transactions/fetchByCustomer',
    async (customerId, { getState, rejectWithValue }) => {
      const { auth } = getState();
      try {
        const response = await axios.get(`http://localhost:5004/api/Transactions/Customer/${customerId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postTransaction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(postTransaction.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(fetchTransactionsByCustomer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactionsByCustomer.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTransactionsByCustomer.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default transactionSlice.reducer;
