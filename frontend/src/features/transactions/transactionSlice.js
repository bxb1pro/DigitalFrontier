import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// transactionSlice holds all state related to transactions
// Thunks handle asynchronous data flow like API calls, and Axios sends these HTTP API requests to backend through the thunks

// Thunk to add a transaction
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
      console.error("Failed to post transaction:", {
        errorData: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      return rejectWithValue(error.response?.data || 'Unknown error during transaction posting');
    }
  }
);

// Thunk to add multiple transactions at once
export const postAllTransactions = createAsyncThunk(
  'transactions/postAllTransactions',
  async (_, { getState, dispatch }) => {
    const { basket, auth } = getState();
    const results = [];
    for (const item of basket.items) {
      const transactionData = {
        GameId: item.id,
        CustomerId: auth.customerId,
        Amount: item.price,
        TransactionDate: new Date().toISOString(),
      };
      try {
        const result = await dispatch(postTransaction(transactionData));
        results.push(result);
      } catch (error) {
        console.error("Error posting transaction for item:", item.id, {
          error: error.message,
          transactionData
        });
      }
    }
    return results;
  }
);

// Thunk to get transactions for a customer
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
      console.error("Failed to fetch transactions by customer:", {
        customerId: customerId,
        errorData: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      return rejectWithValue(error.response?.data || 'Unknown error fetching transactions');
    }
  }
);

// Slice definition (integrating extra reducers)
const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  // Handle async actions created by the thunks to update state
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
      })
      .addCase(postAllTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postAllTransactions.fulfilled, (state, action) => {
        state.transactions.push(...action.payload.map(res => res.payload));
        state.status = 'succeeded';
      })
      .addCase(postAllTransactions.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

// Exporting thunks to be used outside the slice
export default transactionSlice.reducer;
