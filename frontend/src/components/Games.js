import React from 'react';

function Games() {
    return (
        <div className="container mt-5">
            <h2>Games</h2>
            <p>Your favourite games.</p>
        </div>
    );
}

const games = [
    { id: 1, title: "Game Title 1", description: "Game description here", /* other properties */ },
    // other games
];


export default Games;