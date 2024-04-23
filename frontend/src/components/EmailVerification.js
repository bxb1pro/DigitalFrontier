import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmailVerification() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/');
    }, [navigate]);

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

