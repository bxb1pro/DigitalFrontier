import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import GameDetailPage from './components/GameDetailPage';
import Games from './components/Games';
import Login from './components/Login';
import Account from './components/Account';
import Developers from './components/Developers';
import Purchases from './components/Purchases';


function App() {
// Declare the searchTerm state with its setter function
const [searchTerm, setSearchTerm] = useState('');

// Define the handleSearchChange function
const handleSearchChange = (term) => {
  setSearchTerm(term);
};

// New genre state and handler
const [genre, setGenre] = useState('All Genres'); // Add this line

// Define the handleGenreChange function
const handleGenreChange = (newGenre) => { // Add this function
  setGenre(newGenre);
};

return (
  <Router>
    <div>
      {/* Pass handleSearchChange to the Header */}
      <Header onSearchChange={handleSearchChange} onGenreChange={handleGenreChange} genre={genre} />
      <Routes>  
        {/* Pass searchTerm to HomePage as a prop */}
        <Route path="/" element={<HomePage searchTerm={searchTerm} genre={genre} />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/gamedetailpage" element={<GameDetailPage />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </div>
  </Router>
);
}

export default App;


