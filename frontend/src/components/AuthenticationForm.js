// src/components/AuthenticationForm.js
import React from 'react';

function AuthenticationForm({ isRegister, onSubmit }) {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" />
            </div>
            {isRegister && (
                <div className="mb-3">
                    <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="passwordConfirm" placeholder="Confirm Password" />
                </div>
            )}
            {/* Conditionally render username field if this is the register form */}
            {/*isRegister && (
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" placeholder="Username" />
                </div>
            )*/}
            <button type="submit" className="btn btn-primary">
                {isRegister ? 'Register' : 'Login'}
            </button>
        </form>
    );
}

export default AuthenticationForm;
