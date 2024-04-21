import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { editGame } from '../features/games/gamesSlice';

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
        console.log("Updated game data being sent:", updatedGameData);
        dispatch(editGame({ gameId, gameData: updatedGameData }))
            .then((result) => {
                console.log("Edit game action result:", result); // Log the result of dispatching editGame
                navigate('/');
            })
            .catch((error) => {
                console.error("Error editing game:", error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Edit Game: {gameId}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={gameData.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description" rows="3" value={gameData.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" name="price" value={gameData.price} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="genre" className="form-label">Genre</label>
                    <input type="text" className="form-control" id="genre" name="genre" value={gameData.genre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="imageName" className="form-label">Image Name</label>
                    <input type="text" className="form-control" id="imageName" name="imageName" value={gameData.imageName} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="additionalImages" className="form-label">Additional Images</label>
                    <input type="text" className="form-control" id="additionalImages" name="additionalImages" value={gameData.additionalImages} onChange={handleChange} placeholder="Enter comma-separated image names" />
                </div>
                <div className="mb-3">
                    <label htmlFor="releaseDate" className="form-label">Release Date</label>
                    <input type="date" className="form-control" id="releaseDate" name="releaseDate" value={gameData.releaseDate} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="developerId" className="form-label">Developer ID</label>
                    <input type="number" className="form-control" id="developerId" name="developerId" value={gameData.developerId} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
}

export default EditGame;
