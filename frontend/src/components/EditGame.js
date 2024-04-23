import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { editGame } from '../features/games/gamesSlice';
import GameForm from './GameForm'; // Importing the GameForm component

function EditGame() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Initialize state with more detailed game data structure
    const [gameData, setGameData] = useState({
        title: '',
        description: '',
        price: '',
        genre: '',
        imageName: '',
        additionalImages: '',
        releaseDate: '',
        developerId: ''
    });

    // Fetch game data to edit
    useEffect(() => {
        const fetchGameData = async () => {
            const response = await fetch(`http://localhost:5004/api/games/${gameId}`);
            const data = await response.json();
            setGameData({
                title: data.name,
                description: data.description,
                price: data.price,
                genre: data.genre,
                imageName: data.imageName,
                additionalImages: data.additionalImages.join(', '), // Assuming it's an array
                releaseDate: data.releaseDate.split('T')[0], // Formatting ISO string to date input value
                developerId: data.developerId
            });
        };
        fetchGameData();
    }, [gameId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGameData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedGameData = {
            GameId: parseInt(gameId, 10),
            Name: gameData.title,
            Description: gameData.description,
            Price: parseFloat(gameData.price),
            Genre: gameData.genre,
            ImageName: gameData.imageName,
            AdditionalImages: gameData.additionalImages.split(', '), // Converting string back to array
            ReleaseDate: new Date(gameData.releaseDate).toISOString(), // Ensuring date is in correct format
            DeveloperId: parseInt(gameData.developerId, 10)
        };
        dispatch(editGame({ gameId, gameData: updatedGameData }))
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error("Error editing game:", error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Edit Game: {gameId}</h2>
            <GameForm
                gameData={gameData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}

export default EditGame;
