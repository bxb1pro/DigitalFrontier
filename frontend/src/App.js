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
import Unauthorised from './components/Unauthorised';
import EmailVerification from './components/EmailVerification';
import Basket from './components/Basket';

function App() {
  const dispatch = useDispatch();

  // Fetch developers data when the app loads
  useEffect(() => {
    dispatch(fetchDevelopers());
  }, [dispatch]);

  console.log("Component Check: Account", <Account />);
  console.log("Component Check: Purchases", <Purchases />);
  console.log("Component Check: EditGame", <EditGame />);
  console.log("Component Check: AddGame", <AddGame />);
  console.log("Component Check: RemoveGame", <RemoveGame />);

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
          <Route path="/account" element={<PrivateRoute element={Account} roles={['SuperAdmin', 'Admin', 'User']} />} />
          <Route path="/purchases" element={<PrivateRoute element={Purchases} roles={['SuperAdmin', 'Admin', 'User']} />} />
          <Route path="/gamedetailpage" element={<GameDetailPage />} />
          <Route path="/games" element={<Games />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit/:gameId" element={<PrivateRoute element={EditGame} roles={['SuperAdmin', 'Admin']} />} />
          {/* <Route path="/add-game" element={<AddGame />} /> */}
          <Route path="/add-game" element={<PrivateRoute element={AddGame} roles={['SuperAdmin', 'Admin']} />} />
          {/* <Route path="/remove-game/:gameId" element={<RemoveGame />} /> */}
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
