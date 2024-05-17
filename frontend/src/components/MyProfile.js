import React, { useState } from 'react';
import '../assets/styles/MyProfile.css';
import profilePic from '../assets/icons/profilePic.png'; 

const MyProfile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add password change logic here
  };

  return (
    <div className="my-profile">
      <h2 className="profile-page-title">My Profile</h2>
      <div className="profile-card">
        <img src={profilePic} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h3 className="profile-name">Aiden Anovi</h3>
          <p className="profile-email">aidenanovi32@gmail.com</p>
        </div>
        <div className="contact-info">
          <p className="contact-number">Contact Number: (308) 555-0121</p>
        </div>
      </div>
      <div className="profile-details">
        <div className="detail-item">
          <label>Name</label>
          <p>Aiden Anovi</p>
        </div>
        <div className="detail-item">
          <label>Email Address</label>
          <p>aidenanovi32@gmail.com</p>
        </div>
        <div className="detail-item">
          <label>Contact Number</label>
          <p>(308) 555-0121</p>
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
          <button type="submit" className="change-password-button">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
