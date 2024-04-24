import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteGame, fetchGames } from '../features/games/gamesSlice';
import { Button, Card, Image } from 'react-bootstrap';

function RemoveGame() {
    // useParams hook allows for accessing parameters from URL (gameId in this case)
    const { gameId } = useParams();
    // useDispatch is hook to dispatch actions (async or synchronous) to Redux store to change the state
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // useState adds local state to manage state in functions
    const [game, setGame] = useState(null);
    const [isLoading, setLoading] = useState(true);

    // useEffect fetches game data by id
    useEffect(() => {
        const fetchGame = async () => {
            const response = await fetch(`http://localhost:5004/api/games/${gameId}`);
            const data = await response.json();
            setGame(data);
            setLoading(false);
        };
        fetchGame();
    }, [gameId]);

    // Handler to delete game
    const handleRemove = async () => {
        await dispatch(deleteGame(gameId));
        dispatch(fetchGames());
        navigate('/');
    };

    if (isLoading) return <p>Loading...</p>;
    if (!game) return <p>Game not found!</p>;

    return (
        <div className="container mt-5">
            <Card className="text-center">
                <Card.Header as="h5">Confirm Removal</Card.Header>
                <Card.Body>
                    <Image src={`/images/game_artwork/${game.imageName}`} thumbnail style={{ width: "300px", height: "auto" }} />
                    <Card.Title>{game.name}</Card.Title>
                    <Card.Text>
                        Are you sure you want to remove this game from the database?
                    </Card.Text>
                    <Button variant="danger" onClick={handleRemove}>Remove Game</Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default RemoveGame;
