import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Element, roles }) => {
    const location = useLocation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const userRole = useSelector(state => state.auth.role);

    console.log(`PrivateRoute Check: isAuthenticated=${isAuthenticated}, userRole=${userRole}, requiredRoles=${roles}`);
    console.log("Rendering protected component, Element type:", typeof Element, Element);

    if (!isAuthenticated) {
        console.log("Redirecting to login: User not authenticated");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(userRole)) {
        console.log("Redirecting to unauthorised: User role not permitted");
        return <Navigate to="/unauthorised" state={{ from: location }} replace />;
    }

    console.log("Rendering protected component");
    console.log("Element type:", typeof Element, Element);
    return <Element />;
};

export default PrivateRoute;




