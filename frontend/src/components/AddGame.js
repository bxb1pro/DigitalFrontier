import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addGame } from '../features/games/gamesSlice';

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
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={gameData.description}
                        onChange={handleChange}
                        required
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
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="genre" className="form-label">Genre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="genre"
                        name="genre"
                        value={gameData.genre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="imageName" className="form-label">Image Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="imageName"
                        name="imageName"
                        value={gameData.imageName}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="additionalImages" className="form-label">Additional Images</label>
                    <input
                        type="text"
                        className="form-control"
                        id="additionalImages"
                        name="additionalImages"
                        value={gameData.additionalImages}
                        onChange={handleChange}
                        placeholder="Enter comma-separated image names"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="releaseDate" className="form-label">Release Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="releaseDate"
                        name="releaseDate"
                        value={gameData.releaseDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="developerId" className="form-label">Developer ID</label>
                    <input
                        type="number"
                        className="form-control"
                        id="developerId"
                        name="developerId"
                        value={gameData.developerId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Game</button>
            </form>
        </div>
    );
}

export default AddGame;
