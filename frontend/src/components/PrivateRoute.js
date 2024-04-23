import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element: Element, roles }) => {
    const location = useLocation();
    // useSelector is hook to extract data from Redux store state and re-render if state changes
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




