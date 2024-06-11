// src/components/ContactUs.js
import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import '../assets/styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5555/contact', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        message: formData.message,
      });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <>
      <Header />
      <div className="contact-us-container">
        <h1 className="contact-title">Contact Us</h1>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="+1 012 3456 789"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Select Subject</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="subject"
                  value="General Inquiry"
                  checked={formData.subject === 'General Inquiry'}
                  onChange={handleChange}
                /> General Inquiry
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              placeholder="Write your message.."
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <button className="send-button" type="submit">Send Message</button>
        </form>
      </div>
    </>
  );
};

export default ContactUs;
