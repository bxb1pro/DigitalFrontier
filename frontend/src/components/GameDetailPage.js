import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import './GameDetailPage.css';
import DeveloperMap from './DeveloperMap';
import { Button } from 'react-bootstrap';


function GameDetailPage() {
  const { gameId } = useParams();
  const game = useSelector(state => state.games.games.find(g => g.id === parseInt(gameId, 10)));
  console.log("Selected Game:", game);
  const developers = useSelector(state => state.developers.developers);
  const [selectedImage, setSelectedImage] = useState('');

  // Initialize selectedImage with the first image when game data is loaded
  useEffect(() => {
    if (game && game.images && game.images.length > 0) {
      setSelectedImage(game.images[0]);
    }
  }, [game]);

  // Debugging useEffect for developer ID and developers list
  useEffect(() => {
    console.log("Game Developer ID:", game?.developer); // Updated to correct property
    console.log("Developers List:", developers);
  }, [game, developers]);

  if (!game) {
      return <div>Game not found</div>;
  }

  console.log("Game Developer ID:", game.developer, "Type:", typeof game.developer);
  console.log("Developer IDs and Types:");
developers.forEach(dev => console.log(dev.developerId, "Type:", typeof dev.developerId));  // Note the property change

const developer = developers.find(d => {
  console.log(`Comparing ${d.developerId} (type ${typeof d.developerId}) to ${game.developer} (parsed type ${typeof parseInt(game.developer, 10)})`);
  return d.developerId === parseInt(game.developer, 10);
});


  console.log("Checking Developer:", game.developer);  // Log the ID being used for lookup
  console.log("Developers Detailed:", developers);  // Log all developer IDs for comparison
  console.log("Developer Found:", developer);  // See what is found

  const releaseDateFormatted = new Date(game.releaseDate).toLocaleDateString();

  return (
    <div className="game-detail-container">
      <div className="game-images-section">
        <div className="main-image-display">
          <img src={`/images/game_artwork/${selectedImage}`} alt="Selected" className="selected-image" />
        </div>
        <div className="image-thumbnails">
          {game.images.map((image, index) => (
            <img
              key={index}
              src={`/images/game_artwork/${image}`}
              alt={`Thumb ${index}`}
              className={`thumbnail ${image === selectedImage ? 'active' : ''}`}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>

      <div className="game-info-section">
          <h2>{game.title}</h2>
          <div className="game-additional-info">
            <p><strong>Price:</strong> ${game.price.toFixed(2)}</p>
            <p><strong>Genre:</strong> {game.genre}</p>
            <p><strong>Release Date:</strong> {releaseDateFormatted}</p>
            {/* Purchase button with icon */}
            <Button variant="primary" className="purchase-button">
              <i className="bi bi-cart"></i> Purchase
            </Button>
          </div>
          <Tabs defaultActiveKey="overview" id="game-info-tabs" className="custom-tabs">
            <Tab eventKey="overview" title="Info" className="tab-content">
              <p>{game.description}</p>
            </Tab>
            <Tab eventKey="developer" title="Developer" className="tab-content">
              {developer ? (
                <>
                  <p><strong>Name:</strong> {developer.name}</p>
                  <p><strong>Description:</strong> {developer.description}</p>
                  <p><strong>Contact:</strong> {developer.contactEmail}</p>
                </>
              ) : (
                <p>Developer information is not available.</p>
              )}
            </Tab>
            <Tab eventKey="map" title="Map" className="tab-content">
              {developer ? (
              <>
                <p><strong>Address:</strong> {developer.address}</p> 
                <DeveloperMap latitude={developer.latitude} longitude={developer.longitude} developerName={developer.name} />
              </>
              ) : (
              <p>Map information is not available.</p>
              )}
            </Tab>
          </Tabs>
        </div>  
      </div>
  );
}

export default GameDetailPage;


