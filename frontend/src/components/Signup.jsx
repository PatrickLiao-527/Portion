import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Signup.css';
import googleLogo from '../assets/icons/Google-logo.png';
import showHideIcon from '../assets/icons/showHide_icon.png';

const Signup = () => {
  const [profileName, setProfileName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (event) => {
    event.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Create an account</h2>
        <p className="signup-subtitle">
          Already have an account? <Link to="/login" className="login-link">Log in</Link>
        </p>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>What should we call you?</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Enter your profile name"
              required
            />
          </div>
          <div className="form-group">
            <label>What's your email?</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="form-group">
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
