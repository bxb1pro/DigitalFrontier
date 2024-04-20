import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { BsSearch, BsCart4 } from 'react-icons/bs';
import Logout from './Logout';
import { useSelector } from 'react-redux';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';

const Header = ({ onSearchChange, onGenreChange, genre }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const basketItems = useSelector(state => state.basket.items); 
    const handleInputChange = (event) => {
        onSearchChange(event.target.value);
    };

    // Updated handleGenreChange to call onGenreChange with the event value
    const handleGenreChange = (event) => {
        onGenreChange(event.target.textContent); // use textContent to get the dropdown item label
    };

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => setShowLogoutModal(true);
    const handleCloseLogoutModal = () => setShowLogoutModal(false);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-custom">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src="/images/dfglogo.jpeg" alt="Digital Frontier Logo" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* Search container with 'All Categories' dropdown and search input/button */}
                        <div className="search-container">
                            <Dropdown>
                                <Dropdown.Toggle variant="" id="dropdown-basic" className="custom-dropdown-toggle">
                                {genre} {/* Set the button label to the current genre */}
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
                                onChange={handleInputChange} // Add the onChange handler
                            />
                            <button className="btn" type="submit">
                                <BsSearch />
                            </button>
                        </div>
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

