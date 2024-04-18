// src/components/AuthenticationForm.js
import React, { useState } from 'react';

function AuthenticationForm({ isRegister, onSubmit }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');  // Only needed for registration

    const handleFormSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            email,
            password,
            ...(isRegister && { passwordConfirm })  // Include password confirmation if registering
        });
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {isRegister && (
                <div className="mb-3">
                    <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="passwordConfirm"
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                </div>
            )}
            <button type="submit" className="btn btn-primary">
                {isRegister ? 'Register' : 'Login'}
            </button>
        </form>
    );
}

export default AuthenticationForm;

