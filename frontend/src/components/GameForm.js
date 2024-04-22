// GameForm.js
import React from 'react';

function GameForm({ gameData, handleChange, handleSubmit }) {
    return (
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
            <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
    );
}

export default GameForm;
