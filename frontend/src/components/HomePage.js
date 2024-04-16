import React, { useState } from 'react';

function HomePage() {
    // Initial state with three game cards
    const [games, setGames] = useState([
        { id: 1, title: "Game Title 1", text: "Game description here" },
        { id: 2, title: "Game Title 2", text: "Game description here" },
        { id: 3, title: "Game Title 3", text: "Game description here" },
        // Add more initial games as needed
    ]);

    // Function to add a new game card
    const addGame = () => {
        const newGame = {
            id: games.length + 1, // Increment the ID
            title: `Game Title ${games.length + 1}`,
            text: "Game description here",
        };
        setGames([...games, newGame]);
    };

    // Function to remove a game card by ID
    const removeGame = (id) => {
        setGames(games.filter(game => game.id !== id));
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {games.map(game => (
                    <div key={game.id} className="col-md-3 mb-4">
                        <div className="card h-100">
                            <img src={`https://via.placeholder.com/600x900`} className="card-img-top" alt="Game Thumbnail" />
                            <div className="card-body">
                                <h5 className="card-title">{game.title}</h5>
                                <p className="card-text">{game.text}</p>
                                <button onClick={() => removeGame(game.id)} className="btn btn-danger">Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mb-3">
                <button onClick={addGame} className="btn btn-success">Add New Game</button>
            </div>
        </div>
    );
}

export default HomePage;
