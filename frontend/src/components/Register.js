import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearErrors } from '../features/auth/authSlice'; 
import AuthenticationForm from './AuthenticationForm';

function Register() {
    // useDispatch is hook to dispatch actions to Redux store to change state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // useSelector is hook to extract data from Redux store state and re-render if state changes
    const { error } = useSelector(state => state.auth);

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

    useEffect(() => {
        return () => {
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

