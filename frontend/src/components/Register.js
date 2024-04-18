// src/components/Register.js
import React from 'react';
import AuthenticationForm from './AuthenticationForm';

function Register() {
    const handleRegistrationSubmit = (event) => {
        event.preventDefault();
        // Handle the registration submission logic here
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