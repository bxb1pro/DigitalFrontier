import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails, fetchUsersWithRoles } from '../features/auth/authSlice';

function Account() {
    // useDispatch is hook to dispatch actions (async or synchronous) to Redux store to change the state
    const dispatch = useDispatch();
    // useSelector is hook to retrieve state from Redux, and re-render if state changes
    const { user, role, token, users, isLoading, error } = useSelector(state => state.auth);

    // useEffect dispatches fetch for user details and checks role
    useEffect(() => {
        dispatch(fetchUserDetails());

        if (role === 'Admin' || role === 'SuperAdmin') {
            dispatch(fetchUsersWithRoles());
        }
    }, [dispatch, role, token]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-5">
            <h2>Your Account</h2>
            <div className="account-info">
                <p><strong>Email:</strong> {user}</p>
                <p><strong>Role:</strong> {role}</p>
            </div>
            {(role === 'Admin' || role === 'SuperAdmin') && (
                <div>
                    <h3>User List</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Roles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.email}</td>
                                    <td>{user.roles.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Account;
