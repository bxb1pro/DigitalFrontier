import React from 'react';
import { useParams } from 'react-router-dom';
import gamesData from './Games';

function GameDetailPage() {
    let { gameId } = useParams();
    let game = gamesData.find(g => g.id.toString() === gameId);

    if (!game) {
        return <div>Game not found</div>;
    }

    return (
        <div>
            <h2>{game.title}</h2>
            {/* Your image carousel and tabs for game info here */}
        </div>
    );
}

export default GameDetailPage;
