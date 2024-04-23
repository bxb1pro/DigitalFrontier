import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { clearBasket } from '../features/basket/basketSlice';

function Logout({ show, handleClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());  // Dispatch the logout action to reset the state
        console.log('User has logged out');
        navigate('/');  // Redirect to home page after logout
        handleClose();  // Close the modal
        dispatch(clearBasket()); // Clearing one use of local storage in program
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to log out?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Logout;