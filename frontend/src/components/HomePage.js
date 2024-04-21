import React, { useEffect, useState, useMemo } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGames } from '../features/games/gamesSlice';
import { addToWishlist, removeFromWishlist, clearWishlist, fetchWishlist } from '../features/wishlist/wishlistSlice';
import { Modal, Button } from 'react-bootstrap';
import { addToBasket } from '../features/basket/basketSlice';
import { BsCart } from 'react-icons/bs';


function HomePage({ searchTerm, genre }) {
    const dispatch = useDispatch();
    const games = useSelector(state => state.games.games);
    const rawWishlist = useSelector(state => state.wishlist.items);
    const gameStatus = useSelector(state => state.games.status);
    const error = useSelector(state => state.games.error);
    const customerId = useSelector(state => state.auth.customerId);

    // Enrich wishlist with game details
    const wishlist = useMemo(() => {
        return rawWishlist.map(wishItem => {
            const gameDetails = games.find(game => game.id === wishItem.gameId);
            return {
                ...wishItem,
                ...gameDetails  // This spreads the game details into the wishlist item
            };
        });
    }, [rawWishlist, games]);

    console.log('Wishlist State:', wishlist);
    console.log('HomePage Rendered: Current Customer ID:', customerId);

    useEffect(() => {
        if (gameStatus === 'idle') {
            dispatch(fetchGames());
            if (customerId) {
                dispatch(fetchWishlist(customerId));
            }
        }
    }, [customerId, gameStatus, dispatch]);

    const handleAddToWishlist = game => {
        if (!customerId) {
            console.error('Customer ID is undefined at the time of adding to wishlist');
            return; // Optionally handle this case in your UI
        }
        dispatch(addToWishlist({ customerId, gameId: game.id }));
    };

    const handleRemoveFromWishlist = gameWishlistId => {
        if (!gameWishlistId) {
            console.error('Game Wishlist ID is undefined');
            return; // Prevent further action if the ID is undefined
        }
        dispatch(removeFromWishlist(gameWishlistId));
    };

    const filteredGames = games.filter(game => {
        const matchesSearchTerm = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = genre === 'All Genres' || game.genre === genre;
        return matchesSearchTerm && matchesGenre;
    });

    // State for handling modal visibility
    const [show, setShow] = useState(false);
    // Function to show modal
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
                                        <h5 className="card-title">{game.title}</h5>
                                        <p className="card-text" title={game.description}>{game.description}</p>
                                        <Link to={`/edit/${game.id}`} className="btn btn-success me-2">Edit</Link>
                                        <Link to={`/remove-game/${game.id}`} className="btn btn-danger">Remove</Link>
                                        <button onClick={() => handleAddToWishlist(game)} disabled={!customerId} className="btn btn-primary">Add to Wishlist</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="wishlist-box">
                        <h3 className="wishlist-title">Wishlist</h3>
                        <button className="btn btn-danger mb-3" onClick={handleShow}>
                            Clear All
                        </button>
                        {wishlist.map((game, index) => (
                            <div key={index} className="wishlist-item">
                                <img src={`/images/game_artwork/${game.imageName}`} alt={game.title} className="wishlist-item-image" />
                                <div className="wishlist-content">
                                    {/* Add Link to GameDetailPage using game.id */}
                                    <h5>
                                        <Link to={`/game/${game.id}`}>{game.title}</Link>
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
            <Link to="/add-game" className="btn btn-success">Add New Game</Link>
        </div>
    );
}

export default HomePage;
