import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addGame } from '../features/games/gamesSlice';
import GameForm from './GameForm';

function AddGame() {
    const [gameData, setGameData] = useState({
        title: '',
        description: '',
        price: '',
        genre: '',
        imageName: '',
        additionalImages: [],
        releaseDate: '',
        developerId: ''
    });
    // useDispatch is hook to dispatch actions to Redux store to change state
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
            additionalImages = additionalImages.join(', ');
        }
        const newGameData = {
            Name: gameData.title,
            Description: gameData.description,
            Price: parseFloat(gameData.price),
            Genre: gameData.genre,
            ImageName: gameData.imageName,
            AdditionalImages: additionalImages.split(', '),
            ReleaseDate: new Date(gameData.releaseDate + 'Z').toISOString(),
            DeveloperId: parseInt(gameData.developerId, 10)
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
