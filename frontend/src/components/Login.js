import React from 'react';
import { Link } from 'react-router-dom'; // Make sure to import Link from react-router-dom
import AuthenticationForm from './AuthenticationForm';
import { Button } from 'react-bootstrap'; // Import Bootstrap components

function Login() {
    const handleLoginSubmit = (event) => {
        event.preventDefault();
        // Handle the login submission logic here
    };

    return (
        <div className="container mt-5">
            <h2>Login Page</h2>
            <p>Please enter your login credentials.</p>
            <AuthenticationForm isRegister={false} onSubmit={handleLoginSubmit} />
            <div className="mt-4">
                <p>Don't have an account yet?</p>
                {/* Here we use the Bootstrap Button with an icon */}
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

