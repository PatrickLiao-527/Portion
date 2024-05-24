// src/components/EmailVerification.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/EmailVerification.css';

const EmailVerification = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleVerify = () => {
    // Add logic to verify the code here
    console.log('Verification code:', code);
    // Navigate to the desired page after verification
    navigate('/dashboard');
  };

  return (
    <div className="email-verification-page">
      <div className="verification-container">
        <h2>Email Verification</h2>
        <p>Please enter the verification code sent to your email:</p>
        <input 
          type="text" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          placeholder="Verification Code" 
        />
        <button onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
};

export default EmailVerification;
