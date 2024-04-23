import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API endpoint
const API_URL = 'http://localhost:5004/api/games';

export const fetchGames = createAsyncThunk('games/fetchGames', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    let errorInfo = error.response ? 
      { status: error.response.status, data: error.response.data } : 
      { message: "Network or server error occurred" };
    console.error("Failed to fetch games:", errorInfo);
    return rejectWithValue(errorInfo);
  }
});

export const addGame = createAsyncThunk('games/addGame', async (gameData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, gameData);
    return response.data;
  } catch (error) {
    let errorInfo = error.response ? 
      { status: error.response.status, data: error.response.data } : 
      { message: error.message };

    console.error("Failed to add game:", errorInfo);
    return rejectWithValue(errorInfo);
  }
});

export const deleteGame = createAsyncThunk('games/deleteGame', async (gameId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_URL}/${gameId}`);
    return response.data;
  } catch (error) {
    let errorInfo = error.response ? 
      { status: error.response.status, data: error.response.data } : 
      { message: error.message };
    console.error("Failed to delete game:", errorInfo);
    return rejectWithValue(errorInfo);
  }
});

export const editGame = createAsyncThunk('games/editGame', async ({ gameId, gameData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${gameId}`, gameData);
    return response.data;
  } catch (error) {
    let errorInfo = error.response ? 
      { status: error.response.status, data: error.response.data } : 
      { message: error.message };
    console.error("Failed to edit game:", errorInfo);
    return rejectWithValue(errorInfo);
  }
});

export const fetchGameById = createAsyncThunk(
  'games/fetchById',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${gameId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch game by ID failed:", error);
      return rejectWithValue(error.toString());
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    games: [],
    status: 'idle',
    error: null,
    needUpdate: false,
  },
  reducers: {
    gameRemoved(state, action) {
      state.games = state.games.filter(game => game.id !== action.payload);
    },
    updateNeeded(state, action) {
      state.needUpdate = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGames.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games = action.payload.map(game => ({
          id: game.gameId,
          title: game.name,
          genre: game.genre,
          price: game.price,
          releaseDate: game.releaseDate,
          imageName: game.imageName,
          description: game.description,
          images: [game.imageName, ...(game.additionalImages || [])],
          developer: game.developerId
        }));
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addGame.fulfilled, (state, action) => {
        state.games.push({
          id: action.payload.gameId,
          title: action.payload.name,
          genre: action.payload.genre,
          price: action.payload.price,
          releaseDate: action.payload.releaseDate,
          imageName: action.payload.imageName,
          description: action.payload.description,
          images: [action.payload.imageName, ...(action.payload.additionalImages || [])],
          developer: action.payload.developerId
        });
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        const existingIndex = state.games.findIndex(g => g.id === action.payload.gameId);
        if (existingIndex !== -1) {
            // Update the existing game
            state.games[existingIndex] = {
                ...state.games[existingIndex],
                ...action.payload,
                images: [action.payload.imageName, ...(action.payload.additionalImages || [])],
                developer: action.payload.developerId
            };
        } else {
            // Add new game if it doesn't exist
            const newGame = {
                id: action.payload.gameId,
                title: action.payload.name,
                genre: action.payload.genre,
                price: action.payload.price,
                releaseDate: action.payload.releaseDate,
                imageName: action.payload.imageName,
                description: action.payload.description,
                images: [action.payload.imageName, ...(action.payload.additionalImages || [])],
                developer: action.payload.developerId
            };
            state.games.push(newGame);
        }
    })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.games = state.games.filter(game => game.id !== action.meta.arg);
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete game';
      })
      .addCase(editGame.fulfilled, (state, action) => {
        const { payload } = action;
        const index = state.games.findIndex(game => game.id === payload.id);
        if (index !== -1) {
            state.games[index] = {...state.games[index], ...payload};
        }
        state.needUpdate = true; // Set needUpdate to true after editing a game
    })
  },
});

export const { gameRemoved, updateNeeded } = gamesSlice.actions;

export default gamesSlice.reducer;

