import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearErrors } from '../features/auth/authSlice'; 
import AuthenticationForm from './AuthenticationForm';

function Register() {
    // useDispatch is hook to dispatch actions (async or synchronous) to Redux store to change the state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // useSelector is hook to retrieve state from Redux, and re-render if state changes
    const { error } = useSelector(state => state.auth);

    // Handler to check if registration passwords match, navigate to login page on successful registration
    const handleRegistrationSubmit = ({ email, password, passwordConfirm }) => {
        if (password !== passwordConfirm) {
            alert("Passwords don't match!");
            return;
        }

        dispatch(registerUser({ email, password }))
            .unwrap()
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.error('Registration failed:', error);
            });
    };

    // useEffect to clear any errors from failed registration
    useEffect(() => {
        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch]);

    // Re-useable authentication form component is called
    return (
        <div className="container mt-5">
            <h2>Register Page</h2>
            <p>Please enter your registration details.</p>
            <AuthenticationForm isRegister={true} onSubmit={handleRegistrationSubmit} error={error} />
        </div>
    );
}

export default Register;

