import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Header.css';
import profilePic from '../assets/icons/profilePic.png';
import portionLogo from '../assets/icons/portion-Logo.png';
import AuthContext from '../contexts/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="header-wrapper">
      <div className="logo-wrapper">
        <img src={portionLogo} alt="Portion Logo" className="logo" />
        <div className="titles-wrapper">
          <div className="header-title">{user?.restaurantName || 'Restaurant Name'}</div>
        </div>
      </div>
      <div className="nav-links">
        <a href="/contact-us">Contact Us</a>
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
