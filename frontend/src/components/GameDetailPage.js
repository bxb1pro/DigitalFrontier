// src/components/GameDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Import components needed for the carousel and tabs
import Carousel from 'react-bootstrap/Carousel';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function GameDetailPage() {
  const { gameId } = useParams();
    const game = useSelector(state =>
    state.games.games.find(g => g.id === parseInt(gameId, 10))
);

// Check to see if `gameId` and `game` are as expected
console.log('Game ID:', gameId);
console.log('Game:', game);

  if (!game) {
      return <div>Game not found</div>;
  }

  return (
    <div className="game-detail-container">
      <h2>{game.title}</h2>

      {/* Picture Carousel */}
        {game.images && (
        <Carousel>
            {game.images.map((image, index) => (
        <Carousel.Item key={index}>
        <img
          className="d-block w-100"
          src={`/images/game_artwork/${image}`}
          alt={`Slide ${index}`}
        />
        </Carousel.Item>
        ))}
    </Carousel>
    )}

      {/* Tabs for additional info */}
      <Tabs defaultActiveKey="overview" id="game-info-tabs">
        <Tab eventKey="overview" title="Overview">
          <p>{game.description}</p>
        </Tab>
        {/* Other tabs for additional content */}
      </Tabs>

    </div>
  );
}

export default GameDetailPage;
