import React, { useState } from 'react';

function GameForm({ gameData, handleChange, handleSubmit }) {

    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        switch (name) {
            case 'title':
                if (!value) return 'Title is required.';
                return '';
            case 'description':
                if (!value) return 'Description is required.';
                return '';
            case 'price':
                if (value < 0) return 'Price cannot be negative.';
                if (!/^\d+(\.\d{0,2})?$/.test(value)) return 'Price must be a number with up to 2 decimal places.';
                return '';
            case 'genre':
                if (!value) return 'Genre is required.';
                return '';
            case 'imageName':
                if (!value) return 'Image filename is required. Must be a valid filename with extension (e.g. game1.jpg)';
                return '';
            case 'additionalImages':
                if (!value) return 'Additional image filename is required. Must be a valid filename with extension (e.g. game1a.jpg)';
                return '';
            case 'releaseDate':
                if (!value) return 'Release date is required.';
                return '';
            case 'developerId':
                if (!value) return 'Developer ID is required.';
                if (isNaN(value)) return 'Developer ID must be a number.';
                if (value < 1 || value > 11) return 'Developer ID must be between 1 and 11.';
                return '';
            default:
                return '';
        }
    };

    const handleValidationChange = (e) => {
        const { name, value } = e.target;
        handleChange(e);
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateOnSubmit = () => {
        const newErrors = {};
        Object.keys(gameData).forEach(key => {
            const error = validateField(key, gameData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleValidatedSubmit = (e) => {
        e.preventDefault();
        if (validateOnSubmit()) {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleValidatedSubmit}>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={gameData.title}
                    onChange={handleValidationChange}
                    required
                />
                {errors.title && <div className="text-danger">{errors.title}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={gameData.description}
                    onChange={handleValidationChange}
                    required
                />
                {errors.description && <div className="text-danger">{errors.description}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={gameData.price}
                    onChange={handleValidationChange}
                    required
                />
                {errors.price && <div className="text-danger">{errors.price}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="genre" className="form-label">Genre</label>
                <input
                    type="text"
                    className="form-control"
                    id="genre"
                    name="genre"
                    value={gameData.genre}
                    onChange={handleValidationChange}
                    required
                />
                {errors.genre && <div className="text-danger">{errors.genre}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="imageName" className="form-label">Image Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="imageName"
                    name="imageName"
                    value={gameData.imageName}
                    onChange={handleValidationChange}
                    required
                    placeholder="Enter image file name - must be a valid filename with extension (e.g. game1.jpg)"
                />
                {errors.imageName && <div className="text-danger">{errors.imageName}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="additionalImages" className="form-label">Additional Images</label>
                <input
                    type="text"
                    className="form-control"
                    id="additionalImages"
                    name="additionalImages"
                    value={gameData.additionalImages}
                    onChange={handleValidationChange}
                    required
                    placeholder="Enter comma-separated image file names - must be a valid filename with extension (e.g. game1a.jpg)"
                />
                {errors.additionalImages && <div className="text-danger">{errors.additionalImages}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="releaseDate" className="form-label">Release Date</label>
                <input
                    type="date"
                    className="form-control"
                    id="releaseDate"
                    name="releaseDate"
                    value={gameData.releaseDate}
                    onChange={handleValidationChange}
                    required
                />
                {errors.releaseDate && <div className="text-danger">{errors.releaseDate}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="developerId" className="form-label">Developer ID</label>
                <input
                    type="number"
                    className="form-control"
                    id="developerId"
                    name="developerId"
                    value={gameData.developerId}
                    onChange={handleValidationChange}
                    required
                />
                {errors.developerId && <div className="text-danger">{errors.developerId}</div>}
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
    );
}

export default GameForm;
