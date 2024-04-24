import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { BsSearch, BsCart4 } from 'react-icons/bs';
import Logout from './Logout';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';

const Header = ({ onSearchChange, onGenreChange, genre }) => {
    // useSelector is hook to retrieve state from Redux, and re-render if state changes
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const basketItems = useSelector(state => state.basket.items);

    // useState adds local state to manage state in functions
    const [searchInput, setSearchInput] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(genre);
    // useLocation hook accesses current url location
    const location = useLocation();
    const navigate = useNavigate();

    // Handler to update search input when user types, directly triggered if user is on homepage
    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
        if (location.pathname === '/') {
            onSearchChange(event.target.value);
        }
    };

    // Handler to update genre when genre is selected from dropdown
    const handleGenreChange = (newGenre) => {
        setSelectedGenre(newGenre);
        onGenreChange(newGenre);
    };

    // Handler to submit search form, if not on homepage will re-direct to homepage and search
    const handleSubmit = (event) => {
        event.preventDefault();
        if (location.pathname !== '/') {
            navigate(`/?genre=${encodeURIComponent(selectedGenre)}&query=${encodeURIComponent(searchInput)}`);
        } else {
            onSearchChange(searchInput);
        }
    };

    // Function to reset search to defaults
    const resetSearch = () => {
        setSelectedGenre('All Genres');
        setSearchInput('');
        onGenreChange('All Genres');
        onSearchChange('');
    };

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => setShowLogoutModal(true);
    const handleCloseLogoutModal = () => setShowLogoutModal(false);

    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="navbar-custom">
                <Navbar.Brand as={Link} to="/" onClick={resetSearch}>
                    <img src="/images/dfglogo.jpeg" alt="Digital Frontier Logo" height="50" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Form inline="true" onSubmit={handleSubmit} className="mx-auto search-container">
                        <NavDropdown title={selectedGenre} id="dropdown-basic" className="custom-dropdown-toggle">
                            <NavDropdown.Item onClick={() => handleGenreChange('All Genres')}>All Genres</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleGenreChange('Action')}>Action</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleGenreChange('Action RPG')}>Action RPG</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleGenreChange('Battle Royale')}>Battle Royale</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleGenreChange('Fighting')}>Fighting</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleGenreChange('FPS')}>FPS</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleGenreChange('Horror')}>Horror</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleGenreChange('MMORPG')}>MMORPG</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleGenreChange('MOBA')}>MOBA</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleGenreChange('Sports')}>Sports</NavDropdown.Item>
                        </NavDropdown>
                        <FormControl
                            type="search"
                            placeholder="What game are you looking for?"
                            aria-label="Search"
                            value={searchInput}
                            onChange={handleInputChange}
                            className="mr-sm-2"
                        />
                        <Button type="submit" variant="outline-success"><BsSearch /></Button>
                    </Form>
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/purchases">Purchases</Nav.Link>
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/account" className="nav-link">
                                    <i className="bi bi-person-fill"></i>
                                    <span className="account-text">Account</span>
                                </Nav.Link>
                                <Nav.Link onClick={handleLogoutClick} style={{ cursor: 'pointer' }}>Logout</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">Register / Login</Nav.Link>
                        )}
                        <Nav.Link as={Link} to="/basket">
                            <BsCart4 /><span className="basket-item-count">{basketItems.length}</span>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Logout show={showLogoutModal} handleClose={handleCloseLogoutModal} />
        </>
    );
};

export default Header;
