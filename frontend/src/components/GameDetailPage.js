// src/components/GameDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function GameDetailPage() {
    const { gameId } = useParams(); // Get gameId from URL parameters
    const game = useSelector(state =>
        state.games.games.find(g => g.id.toString() === gameId)
    ); // Fetch the game from the Redux store

    if (!game) {
        return <div>Game not found</div>;
    }

    return (
        <div>
            <h2>{game.title}</h2>
            <p>{game.description}</p>
            {/* Your image carousel and tabs for game info here */}
        </div>
    );
}

export default GameDetailPage;
