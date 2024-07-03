import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, googleLogin, fetchUserRole } from '../services/api';
import AuthContext from '../contexts/AuthContext';
import '../assets/styles/Login.css';
//import googleLogo from '../assets/icons/Google-logo.png';
import showHideIcon from '../assets/icons/showHide_icon.png';
//import { GoogleLogin } from '@react-oauth/google';

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
      // Fetch the user's role first
      const userRoleResponse = await fetchUserRole(email);
      const role = userRoleResponse.role;

      // Check if the role is client
      if (role === 'client') {
        setErrorMessage('This is the owner website, please visit the client website');
        return;
      }

      // Proceed with login
      const response = await loginUser({ email, password, role });
      console.log('User logged in successfully:', response);

      setUser(response.user); // Set the user context
      localStorage.setItem('token', response.token); // Store the token
      navigate('/owner/dashboard'); // Redirect to owner dashboard
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to log in');
    }
  };

  const isFormFilled = email !== '' && password !== '';

  const handleGoogleLoginSuccess = async (response) => {
    try {
      console.log('Google login success response:', response);

      const { credential } = response;
      console.log('Google ID token:', credential);

      // Fetch the user's role
      console.log('Fetching user role for email:', email);
      const userRoleResponse = await fetchUserRole(email);
      console.log('User role response:', userRoleResponse);

      const role = userRoleResponse.role;
      console.log('User role:', role);

      // Check if the role is client
      if (role === 'client') {
        setErrorMessage('This is the owner website, please visit the client website');
        return;
      }

      // Send the ID token and role to your backend
      console.log('Sending ID token and role to backend');
      const googleResponse = await googleLogin({ token: credential, role });
      console.log('Google login backend response:', googleResponse);

      setUser(googleResponse.user);
      setToken(googleResponse.token);
      localStorage.setItem('token', googleResponse.token);

      console.log('User set in context and token stored in localStorage');
      navigate('/owner/dashboard');
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
          <Link to="/owner/contact-us?subject=Forgot Password" className="forgot-password-link">
            Forgot your password?
          </Link>
          {/*
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
                  */}
        </div>
        <div className="create-account-container">
          <h2 className="signup-title">Create your new account</h2>
          <Link to="/owner/signup" className="signup-button">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
