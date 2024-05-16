import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Header.css';
import profilePic from '../assets/icons/profilePic.png';

const Header = () => (
  <div className="header-wrapper">
    <div className="logo-wrapper">
      <div className="logo"></div>
      <div className="titles-wrapper">
        <div className="header-title">Portion</div>
        <div className="header-title">Super Healthy Restaurant</div>
      </div>
    </div>
    <div className="nav-links">
      <a href="/contact-us">Contact Us</a>
      <div className="user-wrapper">
        <Link to="/profile" className="user-link">
          <img src={profilePic} alt="Profile" className="user-avatar" />
          <div className="user-name">Alex Smith</div>
        </Link>
      </div>
    </div>
  </div>
);

export default Header;
