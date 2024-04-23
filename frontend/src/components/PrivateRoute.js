import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Element, roles }) => {
    const location = useLocation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const userRole = useSelector(state => state.auth.role);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(userRole)) {
        return <Navigate to="/unauthorised" state={{ from: location }} replace />;
    }
    return <Element />;
};

export default PrivateRoute;




