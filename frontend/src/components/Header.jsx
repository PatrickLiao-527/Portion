// src/components/Header.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/Header.css';
import profilePic from '../assets/icons/profilePic.png';
import portionLogo from '../assets/icons/portion-Logo.png';
import AuthContext from '../contexts/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="header-wrapper">
      <div className="logo-wrapper">
        <img src={portionLogo} alt="Portion Logo" className="logo" />
        <div className="titles-wrapper">
          <div className="header-title">{user?.restaurantName || 'Restaurant Name'}</div>
        </div>
      </div>
      <div className="nav-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link to="/contact-us" className={location.pathname === '/contact-us' ? 'active' : ''}>Contact Us</Link>
        <div className="user-wrapper">
          <Link to="/my-profile" className="user-link">
            <img src={profilePic} alt="Profile" className="user-avatar" />
            <div className="user-name">{user?.name || 'User Name'}</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
