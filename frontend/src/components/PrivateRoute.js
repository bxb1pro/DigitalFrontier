import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Component, roles }) => {
    const location = useLocation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);  // Corrected state access
    const userRole = useSelector(state => state.auth.user?.role);  // Use optional chaining to prevent errors

    // Redirect logic based on authentication and role
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(userRole)) {
        // Redirect to an unauthorized page if the user doesn't have the required role
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    // Render the component if authenticated and authorized
    return Component;
};

export default PrivateRoute;


