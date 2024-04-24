import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchDevelopers } from './features/developers/developersSlice';
import Header from './components/Header';
import HomePage from './components/HomePage';
import GameDetailPage from './components/GameDetailPage';
import Login from './components/Login';
import Account from './components/Account';
import Purchases from './components/Purchases';
import Register from './components/Register';
import EditGame from './components/EditGame';
import AddGame from './components/AddGame';
import RemoveGame from './components/RemoveGame';
import PrivateRoute from './components/PrivateRoute';
import Unauthorised from './components/Unauthorised';
import EmailVerification from './components/EmailVerification';
import Basket from './components/Basket';

// App.js defines main structure and routing of my web app

function App() {
  // useDispatch is hook to dispatch actions (async or synchronous) to Redux store to change the state
  const dispatch = useDispatch();
  // useSelector is hook to retrieve state from Redux, and re-render if state changes
  // Render based on user role
  const role = useSelector(state => state.auth.role);

  useEffect(() => {
    dispatch(fetchDevelopers());
  }, [dispatch]);

  // To manage the search bar in the header
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };
  const [genre, setGenre] = useState('All Genres');
  const handleGenreChange = (newGenre) => {
    setGenre(newGenre);
  };

  return (
    // Site routing, including private routes based on roles
    <Router>
      <div>
        <Header onSearchChange={handleSearchChange} onGenreChange={handleGenreChange} genre={genre} />
        <Routes>
          <Route path="/" element={<HomePage key={role} searchTerm={searchTerm} genre={genre} />} />
          <Route path="/game/:gameId" element={<GameDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<PrivateRoute element={Account} roles={['SuperAdmin', 'Admin', 'User']} />} />
          <Route path="/purchases" element={<PrivateRoute element={Purchases} roles={['SuperAdmin', 'Admin', 'User']} />} />
          <Route path="/gamedetailpage" element={<GameDetailPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit/:gameId" element={<PrivateRoute element={EditGame} roles={['SuperAdmin', 'Admin']} />} />
          <Route path="/add-game" element={<PrivateRoute element={AddGame} roles={['SuperAdmin', 'Admin']} />} />
          <Route path="/remove-game/:gameId" element={<PrivateRoute element={RemoveGame} roles={['SuperAdmin', 'Admin']} />} />
          <Route path="/unauthorised" element={<Unauthorised />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/basket" element={<Basket />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
