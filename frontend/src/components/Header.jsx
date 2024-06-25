// src/components/Header.jsx
import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/Header.css';
// import profilePic from '../assets/icons/profilePic.png';
import portionLogo from '../assets/icons/portion-Logo.png';
import AuthContext from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';

const Header = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const { notifications } = useContext(WebSocketContext);
  const location = useLocation();

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.type === 'profileUpdated') {
        console.log('Profile updated:', notification.data);
        updateUserProfile(notification.data);
      }
    });
  }, [notifications, updateUserProfile]);

  return (
    <div className="header-wrapper">
      <div className="logo-wrapper">
        <img src={portionLogo} alt="Portion Logo" className="logo" />
        <div className="titles-wrapper">
          <div className="header-title">{user?.restaurantName || 'Restaurant Name'}</div>
        </div>
      </div>
      <div className="nav-links">
        <Link to="/owner/dashboard" className={location.pathname === '/owner/dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link to="/owner/contact-us" className={location.pathname === '/owner/contact-us' ? 'active' : ''}>Contact Us</Link>
        <div className="user-wrapper">
          <Link to="/owner/my-profile" className="user-link">
            {/*<img src={profilePic} alt="Profile" className="user-avatar" />*/}
            <div className="user-name">{user ? `${user.name}'s Profile` : 'Account Profile'}</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;