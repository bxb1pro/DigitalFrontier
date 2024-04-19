// src/features/auth/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct named import

const getTokenFromStorage = () => localStorage.getItem('token');
const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
    };  

    const storedToken = getTokenFromStorage();
    const decodedToken = storedToken ? decodeToken(storedToken) : null;

    const initialState = {
        user: decodedToken ? decodedToken.sub : null,
        token: storedToken,
        isAuthenticated: !!storedToken,
        isLoading: false,
        error: null,
        role: decodedToken ? decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null
    };
  
  export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    console.log('Attempting to login with:', userData);
    try {
        const response = await axios.post('http://localhost:5004/api/Account/login', userData);
        console.log('Login response:', response.data);

        const decoded = jwtDecode(response.data.token);
        console.log('Decoded JWT:', decoded);

        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        console.log('User role from JWT:', userRole);

        localStorage.setItem('token', response.data.token);
        return { user: decoded.sub, role: userRole, token: response.data.token };
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
            .addCase(loginUser.pending, (state) => {
                console.log('Login pending...');
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('Login successful:', action.payload);
                console.log('Role received in loginUser:', action.payload.role); 
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.role = action.payload.role;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log('Login failed, error:', action.payload);
                state.error = action.payload;
                state.isLoading = false;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
