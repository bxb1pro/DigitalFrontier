import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthenticationForm from './AuthenticationForm';
import { registerUser } from '../features/auth/authSlice'; 
import { clearErrors } from '../features/auth/authSlice';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error } = useSelector(state => state.auth); // Removed unused `isAuthenticated`

    const handleRegistrationSubmit = ({ email, password, passwordConfirm }) => {
        if (password !== passwordConfirm) {
            alert("Passwords don't match!"); // Consider using local state to handle this error as well
            return;
        }

        dispatch(registerUser({ email, password }))
            .unwrap()
            .then(() => {
                navigate('/login'); // Navigate to login page on successful registration
            })
            .catch((error) => {
                console.error('Registration failed:', error);
                // Optionally update local error state here if needed
            });
    };

    useEffect(() => {
        return () => {
            // Clear errors when the component unmounts
            dispatch(clearErrors());
        };
    }, [dispatch]);


    return (
        <div className="container mt-5">
            <h2>Register Page</h2>
            <p>Please enter your registration details.</p>
            <AuthenticationForm isRegister={true} onSubmit={handleRegistrationSubmit} error={error} />
        </div>
    );
}

export default Register;

