import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addGame } from '../features/games/gamesSlice';
import GameForm from './GameForm'; // Importing the GameForm component

function AddGame() {
    const [gameData, setGameData] = useState({
        title: '',
        description: '',
        price: '',
        genre: '',
        imageName: '',
        additionalImages: [],  // Assuming it can be handled as a string input for simplicity
        releaseDate: '',
        developerId: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGameData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let additionalImages = gameData.additionalImages;
        if (Array.isArray(additionalImages)) {
            additionalImages = additionalImages.join(', '); // Convert array to string
        }
        const newGameData = {
            Name: gameData.title,
            Description: gameData.description,
            Price: parseFloat(gameData.price),
            Genre: gameData.genre,
            ImageName: gameData.imageName,
            AdditionalImages: additionalImages.split(', '), // Convert string to array, assuming comma-separated
            ReleaseDate: new Date(gameData.releaseDate + 'Z').toISOString(),
            DeveloperId: parseInt(gameData.developerId, 10) // Convert string to integer
        };
        dispatch(addGame(newGameData));
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <h2>Add New Game</h2>
            <GameForm
                gameData={gameData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}

export default AddGame;
