import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { BsSearch, BsCart4 } from 'react-icons/bs';
import Logout from './Logout';
import { useSelector } from 'react-redux';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';

const Header = ({ onSearchChange, onGenreChange, genre }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const basketItems = useSelector(state => state.basket.items); 

    // State for search input
    const [searchInput, setSearchInput] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(genre);

    const location = useLocation();
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
        if (location.pathname === '/') {
            onSearchChange(event.target.value);
        }
    };

    const handleGenreChange = (event) => {
        const newGenre = event.target.textContent;
        setSelectedGenre(newGenre);
        onGenreChange(newGenre);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (location.pathname !== '/') {
            // Navigate to home page with search parameters
            navigate(`/?genre=${encodeURIComponent(selectedGenre)}&query=${encodeURIComponent(searchInput)}`);
        } else {
            // Trigger the search directly
            onSearchChange(searchInput);
        }
    };

    const resetSearch = () => {
        setSelectedGenre('All Genres');
        setSearchInput('');
        onGenreChange('All Genres'); // Reset genre
        onSearchChange(''); // Clear search input
    };

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => setShowLogoutModal(true);
    const handleCloseLogoutModal = () => setShowLogoutModal(false);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-custom">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/" onClick={resetSearch}>
                        <img src="/images/dfglogo.jpeg" alt="Digital Frontier Logo" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <form className="search-container" onSubmit={handleSubmit}>
                        {/* Search container with 'All Categories' dropdown and search input/button */}
                            <Dropdown>
                            <Dropdown.Toggle variant="" id="dropdown-basic" className="custom-dropdown-toggle">
                                    {selectedGenre} {/* Changed to use state */}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={handleGenreChange}>All Genres</Dropdown.Item>
                                    <Dropdown.Item onClick={handleGenreChange}>Action</Dropdown.Item>
                                    <Dropdown.Item onClick={handleGenreChange}>Action RPG</Dropdown.Item>
                                    <Dropdown.Item onClick={handleGenreChange}>Battle Royale</Dropdown.Item>
                                    <Dropdown.Item onClick={handleGenreChange}>Fighting</Dropdown.Item>
                                    <Dropdown.Item onClick={handleGenreChange}>FPS</Dropdown.Item>
                                    <Dropdown.Item onClick={handleGenreChange}>Horror</Dropdown.Item>
                                    <Dropdown.Item onClick={handleGenreChange}>MMORPG</Dropdown.Item>
                                    <Dropdown.Item onClick={handleGenreChange}>MOBA</Dropdown.Item>
                                    <Dropdown.Item onClick={handleGenreChange}>Sports</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <input
                                className="form-control"
                                type="search"
                                placeholder="What game are you looking for?"
                                aria-label="Search"
                                value={searchInput} // Bind input value to state
                                onChange={handleInputChange}
                            />
                            <button className="btn" type="submit">
                                <BsSearch />
                            </button>
                        </form>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/purchases">Purchases</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/account">
                                    <i className="bi bi-person-fill"></i>
                                    <span className="account-text">Account</span>
                                </Link>
                                </li>
                                {isAuthenticated ? (
                                    <li className="nav-item" onClick={handleLogoutClick}>
                                        <span className="nav-link" style={{ cursor: 'pointer' }}>Logout</span>
                                    </li>
                                ) : (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Register / Login</Link>
                                    </li>
                                )}
                                {/* Basket icon with item count */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/basket">
                                        <BsCart4 /> <span className="basket-item-count">{basketItems.length}</span>
                                    </Link>
                                </li>

                        </ul>
                    </div>
                </div>
            </nav>
            <Logout show={showLogoutModal} handleClose={handleCloseLogoutModal} />
        </>
    );
};

export default Header;

