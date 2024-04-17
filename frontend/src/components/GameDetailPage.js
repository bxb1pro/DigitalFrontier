// src/components/GameDetailPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import './GameDetailPage.css';

function GameDetailPage() {
  const { gameId } = useParams();
    const game = useSelector(state =>
    state.games.games.find(g => g.id === parseInt(gameId, 10)));
    const [selectedImage, setSelectedImage] = useState('');

    // Initialize selectedImage with the first image when game data is loaded
  React.useEffect(() => {
    if (game && game.images && game.images.length > 0) {
      setSelectedImage(game.images[0]);
    }
  }, [game]);

  if (!game) {
      return <div>Game not found</div>;
  }

  return (
  <div className="game-detail-container">
    <h2>{game.title}</h2>

    {/* Main Image Display */}
    <div className="main-image-display">
      <img src={`/images/game_artwork/${selectedImage}`} alt="Selected" className="selected-image" />
    </div>

    {/* Thumbnails for image selection */}
    <div className="image-thumbnails">
      {game.images.map((image, index) => (
        <img
          key={index}
          src={`/images/game_artwork/${image}`}
          alt={`Thumb ${index}`}
          className={`thumbnail ${image === selectedImage ? 'active' : ''}`}
          onClick={() => setSelectedImage(image)}
          style={{ cursor: 'pointer' }}
        />
      ))}
    </div>

    {/* Tabs for additional info */}
    <Tabs defaultActiveKey="overview" id="game-info-tabs" className="custom-tabs">
      <Tab eventKey="overview" title="Overview" className="tab-content">
        <p>{game.description}</p>
      </Tab>
      {/* Other tabs for additional content */}
    </Tabs>
  </div>
);
}
export default GameDetailPage;
