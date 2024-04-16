// src/components/HomePage.js
import React, { useEffect } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGames, gameAdded, gameRemoved } from '../features/games/gamesSlice';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';

function HomePage() {
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

    const addGame = () => {
        const newGame = {
            id: games.length + 1,
            title: `Game Title ${games.length + 1}`,
            description: "Game description here",
        };
        dispatch(gameAdded(newGame));
    };

    const removeGame = id => {
        dispatch(gameRemoved(id));
    };

    const handleAddToWishlist = game => {
        dispatch(addToWishlist(game));
    };

    const handleRemoveFromWishlist = id => {
        dispatch(removeFromWishlist(id));
    };

    if (gameStatus === 'loading') return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-9">
                    <div className="row">
                        {games.map(game => (
                            <div key={game.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <Link to={`/game/${game.id}`}>
                                        <img src={`/images/game_artwork/${game.imageName}`} className="card-img-top" alt={game.title} />
                                    </Link>
                                    <div className="card-body">
                                        <h5 className="card-title">{game.title}</h5>
                                        <p className="card-text">{game.description}</p>
                                        <button onClick={() => removeGame(game.id)} className="btn btn-danger">Remove</button>
                                        <button onClick={() => handleAddToWishlist(game)} className="btn btn-primary">Add to Wishlist</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-3">
                    <h3>Wishlist</h3>
                    <div className="wishlist-box">
                        {wishlist.map(game => (
                            <div key={game.id} className="wishlist-item">
                                <div className="wishlist-content">
                                    <h5>{game.title}</h5>
                                    <button onClick={() => handleRemoveFromWishlist(game.id)} className="btn btn-danger">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={addGame} className="btn btn-success">Add New Game</button>
        </div>
    );
}

export default HomePage;
