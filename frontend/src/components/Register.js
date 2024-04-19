import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthenticationForm from './AuthenticationForm';

function Register() {
    const navigate = useNavigate();

    const handleRegistrationSubmit = async ({ email, password, passwordConfirm }) => {
        if (password !== passwordConfirm) {
            alert("Passwords don't match!"); // Keep this alert because it is necessary for user feedback
            return;
        }
        try {
            await axios.post('http://localhost:5004/api/account/register', { email, password });
            navigate('/');
        } catch (error) {
            // Logging the error to the console
            console.log(error.response.data); 
            // Extracting error message to display, if available
            let errorMessage = 'Failed to register.';
            if (error.response && error.response.data) {
                // If the server response contains an error message, include it in the alert
                errorMessage += ' ' + (error.response.data.message || error.response.data);
            }
            alert(errorMessage); // Display error messages if registration fails
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register Page</h2>
            <p>Please enter your registration details.</p>
            <AuthenticationForm isRegister={true} onSubmit={handleRegistrationSubmit} />
        </div>
    );
}

export default Register;

