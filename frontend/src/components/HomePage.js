// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGames, deleteGame } from '../features/games/gamesSlice';
import { addToWishlist, removeFromWishlist, clearWishlist } from '../features/wishlist/wishlistSlice';
import { Modal, Button } from 'react-bootstrap'

function HomePage({ searchTerm, genre }) {
    const dispatch = useDispatch();
    const games = useSelector(state => state.games.games);
    const wishlist = useSelector(state => state.wishlist.items);
    const gameStatus = useSelector(state => state.games.status);
    const error = useSelector(state => state.games.error);

    useEffect(() => {
        if (gameStatus === 'idle') {
            dispatch(fetchGames());
        }
    }, [gameStatus, dispatch]);

     // State for handling modal visibility for removal confirmation
     const [showRemoveModal, setShowRemoveModal] = useState(false);
     const [selectedGame, setSelectedGame] = useState(null);
 
     const handleShowRemoveModal = game => {
         setSelectedGame(game);
         setShowRemoveModal(true);
     };
 
     const handleCloseRemoveModal = () => {
         setShowRemoveModal(false);
         setSelectedGame(null);
     };
 
     const confirmRemoveGame = () => {
        if (selectedGame) {
          dispatch(deleteGame(selectedGame.id));
          handleCloseRemoveModal();
        }
      };

    const handleAddToWishlist = game => {
        dispatch(addToWishlist(game));
    };

    const handleRemoveFromWishlist = id => {
        dispatch(removeFromWishlist(id));
    };

    // Enhance the filtering logic to include the genre.
    const filteredGames = games.filter(game => {
        const matchesSearchTerm = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = genre === 'All Genres' || game.genre === genre;
        return matchesSearchTerm && matchesGenre;
    });

    // State for handling modal visibility
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Renamed function to avoid conflict
    const handleClearWishlist = () => {
        dispatch(clearWishlist()); // This dispatches the action from Redux
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
                                        <Link to={`/edit/${game.id}`} className="btn btn-success me-2">
                                            Edit
                                        </Link>
                                        <button onClick={() => handleShowRemoveModal(game)} className="btn btn-danger">Remove</button>
                                        <button onClick={() => handleAddToWishlist(game)} className="btn btn-primary">Add to Wishlist</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="wishlist-box">
                        <h3 className="wishlist-title">Wishlist</h3>
                        <button className="btn btn-danger float-right" onClick={handleShow}>
                            <i className="bi bi-trash"></i> 
                        </button>
                        {wishlist.map(game => (
                            <div key={game.id} className="wishlist-item">
                                <img src={`/images/game_artwork/${game.imageName}`} alt={game.title} className="wishlist-item-image" />
                                <div className="wishlist-content">
                                    <h5>{game.title}</h5>
                                    <button onClick={() => handleRemoveFromWishlist(game.id)} className="btn btn-danger">Remove</button>
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
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleClearWishlist}>
                        Clear Wishlist
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showRemoveModal} onHide={handleCloseRemoveModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Removal</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this game from the database?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRemoveModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmRemoveGame}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
            <Link to="/add-game" className="btn btn-success">Add New Game</Link>
        </div>
    );
}

export default HomePage;
