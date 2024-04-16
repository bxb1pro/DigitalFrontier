import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Account from './components/Account';
import Games from './components/Games';
import Developers from './components/Developers';
import Purchases from './components/Purchases';
import Wishlists from './components/Wishlists';


function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>  
          <Route path="/" element={<HomePage />} exact />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/games" element={<Games />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/wishlists" element={<Wishlists />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


