import React, { useState, useEffect, useContext} from 'react';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';
import '../assets/styles/MyProfile.css';
import profilePic from '../assets/icons/profilePic.png';

const MyProfile = () => {
  const [profileData, setProfileData] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:5555/user/profile', { withCredentials: true });
        console.log('Profile data:', response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {

      setSuccess('Password changed successfully');
      setError('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
    }
  };
  const {signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
  };
  return (
    <div className="my-profile">
      <h2 className="profile-page-title">My Profile</h2>
      <div className="profile-card">
        <img src={profilePic} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h3 className="profile-name">{profileData.name}</h3>
          <p className="profile-email">{profileData.email}</p>
        </div>
        <div className="contact-info-profile">
          <p className="contact-number">Contact Number: {profileData.contactNumber}</p>
        </div>
      </div>
      <div className="profile-details">
        <div className="detail-item">
          <label>Name</label>
          <p>{profileData.name}</p>
        </div>
        <div className="detail-item">
          <label>Email Address</label>
          <p>{profileData.email}</p>
        </div>
        <div className="detail-item">
          <label>Contact Number</label>
          <p>{profileData.contactNumber}</p>
        </div>
      </div>
      <div className="change-password">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="password-item">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="password-item">
            <label>Re-enter Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="change-password-button">Change Password</button>
        </form>
      </div>
      <button className="sign-out-button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default MyProfile;
