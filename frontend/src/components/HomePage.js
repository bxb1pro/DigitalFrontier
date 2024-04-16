import React, { useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
    const [games, setGames] = useState([
        { id: 1, title: "Game Title 1", description: "Game description here" },
        { id: 2, title: "Game Title 2", description: "Game description here" },
        { id: 3, title: "Game Title 3", description: "Game description here" },
    ]);
    const [wishlist, setWishlist] = useState([]);

    const addGame = () => {
        const newGame = {
            id: games.length + 1,
            title: `Game Title ${games.length + 1}`,
            description: "Game description here",
        };
        setGames([...games, newGame]);
    };

    const removeGame = (id) => {
        setGames(games.filter(game => game.id !== id));
    };

    const addToWishlist = (game) => {
        setWishlist([...wishlist, game]);
    };

    const removeFromWishlist = (id) => {
        setWishlist(wishlist.filter(game => game.id !== id));
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-9">
                    <div className="row">
                        {games.map(game => (
                            <div key={game.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <Link to={`/game/${game.id}`}>
                                        <img src={`https://via.placeholder.com/600x900`} className="card-img-top" alt={game.title} />
                                    </Link>
                                    <div className="card-body">
                                        <h5 className="card-title">{game.title}</h5>
                                        <p className="card-text">{game.description}</p>
                                        <button onClick={() => removeGame(game.id)} className="btn btn-danger">Remove</button>
                                        <button onClick={() => addToWishlist(game)} className="btn btn-primary">Add to Wishlist</button>
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
                                    <button onClick={() => removeFromWishlist(game.id)} className="btn btn-danger">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <button onClick={addGame} className="btn btn-success">Add New Game</button>
            </div>
        </div>
    );
}

export default HomePage;
