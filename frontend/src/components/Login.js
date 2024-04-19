import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationForm from './AuthenticationForm';
import { Button } from 'react-bootstrap';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, isLoading } = useSelector(state => state.auth); // Access the auth state including isLoading

    useEffect(() => {
        if (isAuthenticated && !error && !isLoading) {
            navigate('/'); // Redirect to the homepage on successful login
        }
    }, [isAuthenticated, error, isLoading, navigate]);

    const handleLoginSubmit = (credentials) => {
        dispatch(loginUser(credentials))
            .unwrap()
            .catch((error) => {
                console.error('Login failed:', error);
                // Optionally handle error state in UI
            });
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
