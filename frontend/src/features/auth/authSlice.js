// src/features/auth/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getTokenFromStorage = () => {
    const token = localStorage.getItem('token');
    return token ? token : null;
  };
  
  const initialState = {
      user: null,
      token: getTokenFromStorage(), // Initialize token from storage if available
      isAuthenticated: !!getTokenFromStorage(), // Boolean cast: true if token is not null
      isLoading: false,
      error: null
  };
  
  
  export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        console.log('Sending login request with:', userData);
        const response = await axios.post('http://localhost:5004/api/Account/login', userData);
        console.log('Login response data:', response.data);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response.data);
        return rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            console.log('Logging out user');
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('Login successful, updating state with:', action.payload);
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.error('Login failed, error:', action.payload);
                state.error = action.payload;
                state.isLoading = false;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
