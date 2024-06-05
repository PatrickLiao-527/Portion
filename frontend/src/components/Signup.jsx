import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Signup.css';
import googleLogo from '../assets/icons/Google-logo.png';
import showHideIcon from '../assets/icons/showHide_icon.png';

const Signup = () => {
  const [profileName, setProfileName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5555/signup', {
        name: profileName,
        email,
        password,
        role: 'owner'
      });

      console.log('User registered successfully:', response.data);
      navigate('/login'); // Redirect to login page after successful signup
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Create an account</h2>
        <p className="signup-subtitle">
          Already have an account? <Link to="/login" className="login-link">Log in</Link>
        </p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSignup}>
          <div className="form-group-signup">
            <label>What should we call you?</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Enter your profile name"
              required
            />
          </div>
          <div className="form-group-signup">
            <label>What's your email?</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="form-group-signup">
            <label>
              Create a password
              <img
                src={showHideIcon}
                alt="Show/Hide"
                onClick={() => setShowPassword(!showPassword)}
                className="show-hide-icon"
              />
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <p className="password-hint">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
          </div>
          <button type="submit" className="signup-button">Create an account</button>
        </form>
        <div className="terms">
          By creating an account, you agree to the <Link to="/terms">Terms of use</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </div>
        <div className="signup-divider">OR Continue with</div>
        <button className="google-signup-button">
          <img src={googleLogo} alt="Google" className="google-logo" /> Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
