import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditGame() {
    const { gameId } = useParams();  // Getting the game ID from the URL
    const navigate = useNavigate();

    // Placeholder state for game data
    const [gameData, setGameData] = useState({
        title: 'Game Title',
        description: 'Game Description',
        price: 59.99
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGameData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting:', gameData);
        // After submitting, navigate back to the HomePage or wherever is suitable
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <h2>Edit Game: {gameId}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={gameData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                        value={gameData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={gameData.price}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
}

export default EditGame;
