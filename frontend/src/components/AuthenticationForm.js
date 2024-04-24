import React, { useEffect, useState } from 'react';

// Re-useable authentication form for login and register components

function AuthenticationForm({ isRegister, onSubmit, error }) {
    // useState adds local state to manage state in functions
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [localError, setLocalError] = useState('');

    // Function to validate email user input format
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Function to validate password user input format
    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 6) {
            errors.push("Password must be at least 6 characters.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter.");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("Password must contain at least one special character.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number.");
        }
        return errors;
    };

    // Function for form submission; 
    const handleFormSubmit = (event) => {
        event.preventDefault();
        setLocalError('');
    
        if (!isValidEmail(email)) {
            setLocalError('Please enter a valid email address.');
            return;
        }
    
        if (isRegister) {
            if (password !== passwordConfirm) {
                setLocalError("Passwords don't match.");
                return;
            }
    
            const passwordErrors = validatePassword(password);
            if (passwordErrors.length > 0) {
                setLocalError(passwordErrors.join(" "));
                return;
            }
        }
    
        onSubmit({ email, password, ...(isRegister && { passwordConfirm }) });
    };

    useEffect(() => {
        // Cleanup function to reset local errors when component unmounts
        return () => {
            setLocalError('');
        };
    }, []);

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
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
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                </div>
            )}
            {error && <div className="alert alert-danger">{typeof error === 'string' ? error : (error.description || 'This email is already signed up.')}</div>}
            {localError && <div className="alert alert-danger">{localError}</div>}
            <button type="submit" className="btn btn-primary">{isRegister ? 'Register' : 'Login'}</button>
        </form>
    );
}

export default AuthenticationForm;


