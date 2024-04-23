import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const getTokenFromStorage = () => {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        console.error('Error accessing local storage:', error);
        return null;
    }
};

const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

export const fetchUsersWithRoles = createAsyncThunk(
    'auth/fetchUsers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get('http://localhost:5004/api/Account/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch users:', error.message);
            return rejectWithValue(error.response.data);
        }
    }
);

    const storedToken = getTokenFromStorage();
    const decodedToken = storedToken ? decodeToken(storedToken) : null;

    const initialState = {
        user: decodedToken ? decodedToken.sub : null,
        token: storedToken,
        isAuthenticated: !!storedToken,
        isLoading: false,
        error: null,
        role: decodedToken ? decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null,
        customerId: decodedToken ? decodedToken.CustomerId : null,
        users: [] 
    };
  
    export const loginUser = createAsyncThunk(
        'auth/login',
        async (userData, { rejectWithValue }) => {
            try {
                const response = await axios.post('http://localhost:5004/api/Account/login', userData);
                localStorage.setItem('token', response.data.token);
                const decoded = decodeToken(response.data.token);
                return {
                    user: decoded.sub,
                    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                    token: response.data.token,
                    customerId: decoded.CustomerId
                };
            } catch (error) {
                let errorMessage = 'Login failed: Unknown error';
                if (error.response) {
                    errorMessage = error.response.status === 401 ? 'Invalid email or password.' : error.response.data;
                } else {
                    console.error("Network error while logging in:", error.message);
                }
                console.error(errorMessage);
                return rejectWithValue(errorMessage);
            }
        }
    );

    export const registerUser = createAsyncThunk(
        'auth/register',
        async (userData, { rejectWithValue }) => {
            try {
                const response = await axios.post('http://localhost:5004/api/Account/register', userData);
                return response.data;
            } catch (error) {
                let errorMessage = 'Registration failed: Unknown error';
                if (error.response) {
                    errorMessage = error.response.status === 409 ? 'Email already exists.' : error.response.data;
                } else {
                    console.error("Network error while registering:", error.message);
                }
                console.error(errorMessage);
                return rejectWithValue(errorMessage);
            }
        }
    );

    export const fetchUserDetails = createAsyncThunk('auth/fetchUserDetails', async (_, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        if (!token) {
            return rejectWithValue('No token found');
        }
    });

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.customerId = null; // Clear customerId on logout
            state.role = null; // Make sure this is reset
        },
        // error checking, remove after
        setUserDetailsFromToken(state, action) {
            state.user = action.payload.sub;
            state.customerId = action.payload.customerId;
            state.isAuthenticated = true;
            state.role = action.payload.role;
        },
        clearErrors(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.role = action.payload.role;
                state.customerId = action.payload.customerId; // Store customerId in state
                state.isLoading = false;
                state.error = null;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
                state.isAuthenticated = false;
            })
            .addCase(fetchUsersWithRoles.fulfilled, (state, action) => {
                state.users = action.payload;
              })
            .addCase(fetchUsersWithRoles.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isAuthenticated = false; // Set to false to require separate login
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
                state.isAuthenticated = false; // Keep as false since registration failed
            });
    }
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
