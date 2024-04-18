import React from 'react';
import { Button } from 'react-bootstrap'; // Make sure to import the Button component

// Dummy user data for illustration purposes
const userData = {
    email: "user@example.com",
    signUpDate: new Date(2020, 0, 1) // Replace with actual data source
};

function Account() {
    // Function to handle account deletion logic
    const handleDeleteAccount = () => {
        // Insert logic to handle the account deletion
        console.log("Account deletion initiated");
    };

    // Format the date to a readable format
    const formattedSignUpDate = userData.signUpDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="container mt-5">
            <h2>Account Page</h2>
            <p>Manage your account settings here.</p>
            <div className="account-info">
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Sign Up Date:</strong> {formattedSignUpDate}</p>
            </div>
            {/* Add delete account button here */}
            <div className="mt-4">
                <Button variant="danger" onClick={handleDeleteAccount}>
                    <i className="bi bi-trash"></i> Delete Account
                </Button>
            </div>
        </div>
    );
}

export default Account;
