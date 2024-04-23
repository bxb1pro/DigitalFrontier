import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchGames, updateNeeded } from '../features/games/gamesSlice';
import { addToWishlist, removeFromWishlist, clearWishlist, fetchWishlist } from '../features/wishlist/wishlistSlice';
import { addToBasket } from '../features/basket/basketSlice';
import { Modal, Button } from 'react-bootstrap';
import { BsCart, BsStar } from 'react-icons/bs';
import './HomePage.css';


function HomePage({ searchTerm, genre }) {
    // useDispatch is hook to dispatch actions to Redux store to change state
    const dispatch = useDispatch();
    // useSelector is hook to extract data from Redux store state and re-render if state changes
    const games = useSelector(state => state.games.games);
    const rawWishlist = useSelector(state => state.wishlist.items);
    const gameStatus = useSelector(state => state.games.status);
    const error = useSelector(state => state.games.error);
    const customerId = useSelector(state => state.auth.customerId);
    const role = useSelector(state => state.auth.role);
    const location = useLocation();
    const needUpdate = useSelector(state => state.games.needUpdate); 

    const isAdmin = useMemo(() => ['SuperAdmin', 'Admin'].includes(role), [role]);

    const [showCustomModal, setShowCustomModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const wishlist = useMemo(() => {
        return rawWishlist.map(wishItem => {
            const gameDetails = games.find(game => game.id === wishItem.gameId);
            return {
                ...wishItem,
                ...gameDetails
            };
        });
    }, [rawWishlist, games]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchGames());
                if (customerId) {
                    dispatch(fetchWishlist(customerId));
                }
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                if (gameStatus === 'succeeded') {
                    dispatch(updateNeeded(false)); 
                }
            }
        };

        if (gameStatus === 'idle' || gameStatus === 'failed' || needUpdate) {
            fetchData();
        }

        }, [customerId, gameStatus, dispatch, location.pathname, needUpdate]);


    const handleAddToWishlist = game => {
        if (!customerId) {
            setModalMessage('Customer ID is undefined.');
            setShowCustomModal(true);
            return;
        }
        const isAlreadyAdded = wishlist.some(wishItem => wishItem.gameId === game.id);
        if (isAlreadyAdded) {
            setModalMessage('This game is already in your wishlist.');
            setShowCustomModal(true);
            return;
        }
        dispatch(addToWishlist({ customerId, gameId: game.id }));
    };

    const handleRemoveFromWishlist = gameWishlistId => {
        if (!gameWishlistId) {
            console.error('Game Wishlist ID is undefined');
            return;
        }
        dispatch(removeFromWishlist(gameWishlistId));
    };

    const filteredGames = games.filter(game => {
        const matchesSearchTerm = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = genre === 'All Genres' || game.genre === genre;
        return matchesSearchTerm && matchesGenre;
    });

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleClearWishlist = () => {
        if (!customerId) {
            console.error('Customer ID is undefined.');
            return;
        }
        dispatch(clearWishlist(customerId));
        handleClose();
    };

    if (gameStatus === 'loading') return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-5">
        {isAdmin && <Link to="/add-game" className="btn btn-success link-to-add-game">Add New Game</Link>}
            <div className="row">
                <div className="col-md-9">
                    <div className="row">
                        {filteredGames.map(game => (
                            <div key={game.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <Link to={`/game/${game.id}`}>
                                        <img src={`/images/game_artwork/${game.imageName}`} className="card-img-top" alt={game.title} />
                                    </Link>
                                    <div className="card-body">
                                    <h5 className="card-title">
                                        <Link to={`/game/${game.id}`} className="game-title-link">
                                            {game.title}
                                        </Link>
                                        <div className="game-price">
                                            £{game.price.toFixed(2)}
                                        </div>
                                    </h5>
                                        <p className="card-text">{game.description}</p>
                                        {isAdmin && (
                                            <>
                                                <Link to={`/edit/${game.id}`} className="btn btn-success btn-uniform">Edit</Link>
                                                <Link to={`/remove-game/${game.id}`} className="btn btn-danger btn-uniform">Remove</Link>
                                            </>
                                        )}
                                        <div className="button-group">
                                        <button onClick={() => handleAddToWishlist(game)} disabled={!customerId} className="btn btn-primary add-to-cart-btn">Add to Wishlist <BsStar /></button>
                                        <button onClick={() => dispatch(addToBasket(game))} disabled={!customerId} className="btn btn-primary add-to-cart-btn">Add to Basket <BsCart /></button>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-3">
                <div className="wishlist-box">
                    <div className="wishlist-header">
                        <h3 className="wishlist-title">Wishlist</h3>
                        <Button 
                            className="btn btn-danger wishlist-clear-btn" 
                            onClick={handleShow}
                            disabled={!customerId || wishlist.length === 0}>
                            <i className="bi bi-trash"></i>
                        </Button>
                    </div>
                    {wishlist.map((game, index) => (
                        <div key={index} className="wishlist-item">
                            <img src={`/images/game_artwork/${game.imageName}`} alt={game.title} className="wishlist-item-image" />
                            <div className="wishlist-content">
                                <h5>
                                    <Link to={`/game/${game.id}`} className="game-title-link">
                                        {game.title}
                                    </Link>
                                </h5>
                                <button onClick={() => handleRemoveFromWishlist(game.gameWishlistId)} className="btn btn-danger">Remove</button>
                                <button 
                                    onClick={() => dispatch(addToBasket(game))}
                                    className="btn btn-primary">
                                    <BsCart />
                                </button>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Clear Wishlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to clear all items from your wishlist?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleClearWishlist}>Clear Wishlist</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showCustomModal} onHide={() => setShowCustomModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCustomModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default HomePage;
