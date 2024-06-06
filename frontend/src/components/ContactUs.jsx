// src/components/ContactUs.js
import '../assets/styles/ContactUs.css';

const ContactUs = () => {

  return (
    <div className="contact-us-container">
      <h1 className="contact-title">Contact Us</h1>
        <div className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="Enter your first name" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Doe" />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email address" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" placeholder="+1 012 3456 789" />
          </div>
          <div className="form-group">
            <label>Select Subject?</label>
            <div className="radio-group">
              <label><input type="radio" name="subject" /> General Inquiry</label>
              <label><input type="radio" name="subject" /> General Inquiry</label>
              <label><input type="radio" name="subject" /> General Inquiry</label>
              <label><input type="radio" name="subject" /> General Inquiry</label>
            </div>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Write your message.."></textarea>
          </div>
          <button className="send-button">Send Message</button>
        </div>
      </div>
  );
};

export default ContactUs;
