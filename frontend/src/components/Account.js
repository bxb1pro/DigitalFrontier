import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails } from '../features/auth/authSlice';

function Account() {
    const dispatch = useDispatch();
    const { user, role } = useSelector(state => state.auth); // Remove joinDate from destructuring

    useEffect(() => {
        dispatch(fetchUserDetails());
    }, [dispatch]);

    return (
        <div className="container mt-5">
            <h2>Account Page</h2>
            <div className="account-info">
                <p><strong>Email:</strong> {user}</p>
                <p><strong>Role:</strong> {role}</p>
            </div>
        </div>
    );
}

export default Account;
