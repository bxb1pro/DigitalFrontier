import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addToBasket } from '../features/basket/basketSlice';
import { fetchGameById } from '../features/games/gamesSlice';
import DeveloperMap from './DeveloperMap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Modal, Button } from 'react-bootstrap';
import './GameDetailPage.css';


function GameDetailPage() {
  // useParams hook allows for accessing parameters from URL (gameId in this case)
  const { gameId } = useParams();
  // useSelector is hook to retrieve state from Redux, and re-render if state changes
  const game = useSelector(state => 
    state.games.games.find(g => g.id === parseInt(gameId, 10))
  );
  // useDispatch is hook to dispatch actions (async or synchronous) to Redux store to change the state
  const dispatch = useDispatch();
  // useSelector is hook to retrieve state from Redux, and re-render if state changes
  const developers = useSelector(state => state.developers.developers);
  const [selectedImage, setSelectedImage] = useState('');
  const role = useSelector(state => state.auth.role);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // useEffect checks if game is already loaded, if not dispatches fetch for game info by ID
  useEffect(() => {
    if (!game) {
      setIsLoading(true);
      dispatch(fetchGameById(parseInt(gameId, 10)))
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [gameId, game, dispatch]);

  // useEffect sets initial image display to first image in game array
  useEffect(() => {
    if (game && game.images && game.images.length > 0) {
      setSelectedImage(game.images[0]);
    }
  }, [game]);

  // Event handler to add game to basket (checks for login and role)
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setModalMessage('Please login to use this feature');
      setShowModal(true);
    } else if (['SuperAdmin', 'Admin'].includes(role)) {
      setModalMessage('Please do not purchase games on an admin account');
      setShowModal(true);
    } else {
      dispatch(addToBasket(game));
    }
  };

  // Event handler to close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  const developer = developers.find(d => {
    return d.developerId === parseInt(game.developer, 10);
  });

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
            <p><strong>Price:</strong> £{game.price.toFixed(2)}</p>
            <p><strong>Genre:</strong> {game.genre}</p>
            <p><strong>Release Date:</strong> {releaseDateFormatted}</p>
            <Button variant="primary" className="basket-button" onClick={handleAddToCart}>
            <i className="bi bi-cart"></i> Add to Basket
            </Button>
          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            </Modal.Footer>
          </Modal>
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
                <p><strong>Developer Address:</strong> {developer.address}</p> 
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


