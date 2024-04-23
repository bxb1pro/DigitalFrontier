import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearErrors } from '../features/auth/authSlice';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';
import AuthenticationForm from './AuthenticationForm';
import { Button } from 'react-bootstrap';

function Login() {
    // useDispatch is hook to dispatch actions to Redux store to change state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // useSelector is hook to extract data from Redux store state and re-render if state changes
    const { isAuthenticated, error, isLoading, customerId } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated && !error && !isLoading && customerId) {
            dispatch(fetchWishlist(customerId));
            navigate('/');
        }
    }, [isAuthenticated, error, isLoading, customerId, dispatch, navigate]);

    useEffect(() => {
        return () => {
            // Clear errors when the component unmounts
            dispatch(clearErrors());
        };
    }, [dispatch]);

    const handleLoginSubmit = (credentials) => {
        dispatch(loginUser(credentials))
            .unwrap()
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Login Page</h2>
            <p>Please enter your login credentials.</p>
            <AuthenticationForm isRegister={false} onSubmit={handleLoginSubmit} error={error} />
            <div className="mt-4">
                <h4>Don't have an account yet?</h4>
                <Link to="/register" className="d-block">
                <Button variant="link" className="p-0 d-inline-flex align-items-center" style={{ fontSize: 'larger', fontWeight: 'bold' }}>
                    <i className="bi bi-pencil-square" style={{ fontSize: 'larger', fontWeight: 'bold' }}></i>
                    <span className="ms-2" style={{ fontSize: 'larger', fontWeight: 'bold' }}>Register</span>
                </Button>
                </Link>
            </div>
        </div>
    );
}

export default Login;
