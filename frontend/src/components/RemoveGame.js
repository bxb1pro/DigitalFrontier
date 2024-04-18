import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Image } from 'react-bootstrap';
import { deleteGame, fetchGames } from '../features/games/gamesSlice';

function RemoveGame() {
    const { gameId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        // Assuming you have a way to fetch a single game by ID
        const fetchGame = async () => {
            const response = await fetch(`http://localhost:5004/api/games/${gameId}`);
            const data = await response.json();
            setGame(data);
            setLoading(false);
        };
        fetchGame();
    }, [gameId]);

    const handleRemove = async () => {
        await dispatch(deleteGame(gameId));
        dispatch(fetchGames()); // Refetch games after deletion
        navigate('/'); // Redirect after removal
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
