import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorised = () => {
    return (
        <div className="container mt-5">
            <h1>Access Denied</h1>
            <p>You do not have permission to view this page.</p>
            <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
    );
};

export default Unauthorised;
