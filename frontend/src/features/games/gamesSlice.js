// src/features/games/gamesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API endpoint
const API_URL = 'http://localhost:5004/api/games';

export const fetchGames = createAsyncThunk('games/fetchGames', async () => {
  const response = await axios.get(API_URL);
  console.log("Fetched games:", response.data); 
  return response.data;
});

export const addGame = createAsyncThunk('games/addGame', async (gameData) => {
  const response = await axios.post(API_URL, gameData);
  return response.data;
});

export const deleteGame = createAsyncThunk('games/deleteGame', async (gameId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_URL}/${gameId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const editGame = createAsyncThunk('games/editGame', async ({ gameId, gameData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${gameId}`, gameData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchGameById = createAsyncThunk(
  'games/fetchById',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5004/api/Games/${gameId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    games: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    gameRemoved(state, action) {
      state.games = state.games.filter(game => game.id !== action.payload);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGames.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("Games data after fetch:", action.payload);
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
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.games = state.games.filter(game => game.id !== action.meta.arg);
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete game';
      })
      .addCase(editGame.fulfilled, (state, action) => {
        const index = state.games.findIndex(game => game.id === action.payload.id);
        if (index !== -1) {
          state.games[index] = {...state.games[index], ...action.payload};
        }
      });
  },
});

export const { gameRemoved } = gamesSlice.actions;

export default gamesSlice.reducer;

