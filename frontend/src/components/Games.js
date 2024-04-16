// src/components/Games.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Games() {
    const games = useSelector(state => state.games.games); // Fetch games from Redux store

    return (
        <div className="container mt-5">
            <h2>Games</h2>
            {games.length > 0 ? (
                <ul>
                    {games.map(game => (
                        <li key={game.id}>
                             <Link to={`/game/${game.id}`}>
                                <img src={`/images/game_artwork/${game.imageName}`} alt={game.title} style={{ width: "100px", height: "auto" }} />
                                {game.title}
                            </Link> - {game.description}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No games found. Please check back later.</p>
            )}
        </div>
    );
}

export default Games;
