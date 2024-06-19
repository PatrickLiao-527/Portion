import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import '../assets/styles/Login.css';
import googleLogo from '../assets/icons/Google-logo.png';
import showHideIcon from '../assets/icons/showHide_icon.png';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5555/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      console.log('User logged in successfully:', response.data);

      setUser(response.data.user); // Set the user context
      localStorage.setItem('token', response.data.token); // Store the token
      navigate('/dashboard'); // Redirect to dashboard 
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to log in');
    }
  };

  const isFormFilled = email !== '' && password !== '';

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response; // Use the credential, which is the ID token
  
      // Send the ID token to your backend
      const googleResponse = await axios.post('http://localhost:5555/auth/google-login', {
        token: credential,
      }, {
        withCredentials: true
      });
  
      console.log('User logged in successfully with Google:', googleResponse.data);
  
      setUser(googleResponse.data.user); // Set the user context
      setToken(googleResponse.data.token); // Set the token context
      localStorage.setItem('token', googleResponse.data.token); // Store the token
      navigate('/dashboard'); // Redirect to dashboard

    } catch (error) {
      console.error('Error logging in with Google:', error);
      setErrorMessage('Failed to log in with Google');
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login error:', error);
    setErrorMessage('Google login failed. Please try again.');
  };
  
  return (
    <div className="login-page">
      <div className="login-frame">
        <div className="login-container">
          <h2 className="login-title">Log in to your account</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group-login">
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group-login">
              <label>
                Password
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
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button 
              type="submit" 
              className={`login-button ${isFormFilled ? 'filled' : 'unfilled'}`}
              disabled={!isFormFilled}
            >
              Log in
            </button>
          </form>
          <Link to="/contact-us?subject=Forgot Password" className="forgot-password-link">
            Forgot your password?
          </Link>
          <div className="login-divider">Or log in with</div>
          <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            render={(renderProps) => (
              <button 
                className="google-login-button" 
                onClick={renderProps.onClick} 
                disabled={renderProps.disabled}
              >
                <img src={googleLogo} alt="Google" className="google-logo" /> Google
              </button>
            )}
          />
        </div>
        </div>
        <div className="create-account-container">
          <h2 className="signup-title">Create your new account</h2>
          <Link to="/signup" className="signup-button">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
