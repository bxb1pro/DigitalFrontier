// src/features/games/gamesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Update this to the actual endpoint of your API
const API_URL = 'http://localhost:5004/api/games';

export const fetchGames = createAsyncThunk('games/fetchGames', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    games: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    gameAdded(state, action) {
      state.games.push(action.payload);
    },
    gameRemoved(state, action) {
      state.games = state.games.filter(game => game.id !== action.payload);
    }
  },
  extraReducers(builder) {
    builder
      // When fetchGames is pending, update the state to indicate loading is in progress
      .addCase(fetchGames.pending, state => {
        state.status = 'loading';
      })
      // When fetchGames is fulfilled, update the games state
      // and map the data to match the frontend's expected format if necessary
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Map the backend game data to the frontend game structure
        state.games = action.payload.map(game => ({
          id: game.id,
          title: game.name,
          genre: game.genre, // Or any other property for the description
          price: game.price,
          releaseDate: game.releaseDate,
          imageName: game.imageName,
          description: game.description,
          // Include any other data you need from the game object
        }));
      })
      // Handle a rejected promise, in case the backend API call fails
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { gameAdded, gameRemoved } = gamesSlice.actions;

export default gamesSlice.reducer;
