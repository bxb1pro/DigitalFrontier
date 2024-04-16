import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';

const Header = () => {
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
                                    <Dropdown.Item href="#/action-1">Category 1</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Category 2</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Category 3</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <input className="form-control" type="search" placeholder="What game are you looking for?" aria-label="Search" />
                            <button className="btn" type="submit">
                                <BsSearch />
                            </button>
                        </div>
                        <ul className="navbar-nav ms-auto">
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
                                <Link className="nav-link" to="/login">Logout</Link>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
                <div className="navbar navbar-expand navbar-dark tabs-navbar">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item tab-item">
                            <Link className="nav-link tab-link" to="/games">Games</Link>
                        </li>
                        <li className="nav-item tab-item">
                            <Link className="nav-link tab-link" to="/developers">Developers</Link>
                        </li>
                        <li className="nav-item tab-item">
                            <Link className="nav-link tab-link" to="/wishlists">Wishlists</Link>
                        </li>
                        <li className="nav-item tab-item">
                            <Link className="nav-link tab-link" to="/purchases">Purchase History</Link>
                        </li>
                    </ul>
                </div>
        </>
    );
};

export default Header;

