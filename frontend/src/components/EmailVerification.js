import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmailVerification() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to the home page immediately
        navigate('/');
    }, [navigate]);

    // Optionally, you can display a loading message while the redirection is in progress
    return (
        <div style={{
          marginTop: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: '20px'
        }}>
            <h2>Email Verification</h2>
            <p>Redirecting you to the homepage...</p>
        </div>
    );
}

export default EmailVerification;

