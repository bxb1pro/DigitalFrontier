import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';

const Header = ({ onSearchChange }) => {
    // Add an event handler for input changes
    const handleInputChange = (event) => {
        // Call the handler from HomePage with the new search term
        onSearchChange(event.target.value);
    };
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
                                    All Genres
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">All Genres</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Action RPG</Dropdown.Item>
                                    <Dropdown.Item href="#/action-4">Battle Royale</Dropdown.Item>
                                    <Dropdown.Item href="#/action-5">Fighting</Dropdown.Item>
                                    <Dropdown.Item href="#/action-6">FPS</Dropdown.Item>
                                    <Dropdown.Item href="#/action-7">Horror</Dropdown.Item>
                                    <Dropdown.Item href="#/action-8">MMORPG</Dropdown.Item>
                                    <Dropdown.Item href="#/action-9">MOBA</Dropdown.Item>
                                    <Dropdown.Item href="#/action-10">Sports</Dropdown.Item>
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
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Register / Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/logout">Logout</Link>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;

