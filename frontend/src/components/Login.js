// src/components/Login.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';
import AuthenticationForm from './AuthenticationForm';
import { Button } from 'react-bootstrap';

function Login() {
    const dispatch = useDispatch();

    const handleLoginSubmit = (credentials) => {
        dispatch(loginUser(credentials));  // Dispatch the loginUser action from authSlice
    };

    return (
        <div className="container mt-5">
            <h2>Login Page</h2>
            <p>Please enter your login credentials.</p>
            <AuthenticationForm isRegister={false} onSubmit={handleLoginSubmit} />
            <div className="mt-4">
                <p>Don't have an account yet?</p>
                <Link to="/register" className="d-block">
                    <Button variant="link" className="p-0 d-inline-flex align-items-center">
                        <i className="bi bi-pencil-square"></i>
                        <span className="ms-2">Register</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Login;


