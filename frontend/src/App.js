import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchDevelopers } from './features/developers/developersSlice';
import Header from './components/Header';
import HomePage from './components/HomePage';
import GameDetailPage from './components/GameDetailPage';
import Games from './components/Games';
import Login from './components/Login';
import Account from './components/Account';
import Purchases from './components/Purchases';
import loadScript from './utils/loadScript';
import Register from './components/Register';
import EditGame from './components/EditGame';
import AddGame from './components/AddGame';
import RemoveGame from './components/RemoveGame';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const dispatch = useDispatch();
  
  // Fetch developers data when the app loads
  useEffect(() => {
    dispatch(fetchDevelopers());
  }, [dispatch]);

  // Declare the searchTerm state with its setter function
  const [searchTerm, setSearchTerm] = useState('');

  // Define the handleSearchChange function
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // New genre state and handler
  const [genre, setGenre] = useState('All Genres');

  // Define the handleGenreChange function
  const handleGenreChange = (newGenre) => {
    setGenre(newGenre);
  };

  useEffect(() => {
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCwIXyqJr9tjrny4DC3hEL1DoAaXUQV0kM', 'body', 'google-maps-script');
  }, []);

  return (
    <Router>
      <div>
        {/* Pass handleSearchChange to the Header */}
        <Header onSearchChange={handleSearchChange} onGenreChange={handleGenreChange} genre={genre} />
        <Routes>
          {/* Pass searchTerm to HomePage as a prop */}
          <Route path="/" element={<HomePage searchTerm={searchTerm} genre={genre} />} exact />
          <Route path="/game/:gameId" element={<GameDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<PrivateRoute component={Account} roles={['SuperAdmin, Admin']} />} />
          <Route path="/purchases" element={<PrivateRoute component={Purchases} roles={['SuperAdmin, Admin']} />} />
          <Route path="/gamedetailpage" element={<GameDetailPage />} />
          <Route path="/games" element={<Games />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit/:gameId" element={<PrivateRoute component={EditGame} roles={['SuperAdmin, Admin']} />} />
          {/* <Route path="/add-game" element={<AddGame />} /> */}
          <Route path="/add-game" element={<PrivateRoute component={AddGame} roles={['SuperAdmin, Admin']} />} />
          {/* <Route path="/remove-game/:gameId" element={<RemoveGame />} /> */}
          <Route path="/remove-game/:gameId" element={<PrivateRoute component={RemoveGame} roles={['SuperAdmin, Admin']} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
