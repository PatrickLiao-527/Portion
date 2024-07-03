import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/Header.css';
import portionLogo from '../assets/icons/portion-Logo.png';
import { fetchProfile } from '../services/api';
import AuthContext from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const { notifications } = useContext(WebSocketContext);
  const location = useLocation();
  const [restaurantName, setRestaurantName] = useState(user?.restaurantName || 'Restaurant Name');

  const fetchProfileData = useCallback(async () => {
    try {
      const response = await fetchProfile();
      console.log('Fetched profile data:', response);
      setUser(response.user);
      setRestaurantName(response.restaurant?.name || 'Restaurant Name');
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }, [setUser]);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.type === 'profileUpdated') {
        console.log('Profile updated:', notification.data);
        fetchProfileData();
      }
    });
  }, [notifications, fetchProfileData]);

  return (
    <div className="header-wrapper">
      <div className="logo-wrapper">
        <img src={portionLogo} alt="Portion Logo" className="logo" />
        <div className="titles-wrapper">
          <div className="header-title">{restaurantName}</div>
        </div>
      </div>
      <div className="nav-links">
        <Link to="/owner/dashboard" className={location.pathname === '/owner/dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link to="/owner/contact-us" className={location.pathname === '/owner/contact-us' ? 'active' : ''}>Contact Us</Link>
        <div className="user-wrapper">
          <Link to="/owner/my-profile" className="user-link">
            <div className="user-name">{user ? `${user.name}'s Profile` : 'Account Profile'}</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
