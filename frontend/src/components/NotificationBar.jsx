import React, { useContext } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext'; // Adjust the import path as needed
import '../assets/styles/NotificationBar.css'; // Ensure you have the appropriate CSS file

const NotificationBar = () => {
  const { notifications } = useContext(WebSocketContext);
  const latestNotification = notifications[notifications.length - 1];

  return (
    <>
      {latestNotification && latestNotification.type === 'NEW_ORDER' && (
        <div className="notification-bar">
          <div className="notification-content">
            <button className="close-button" onClick={() => window.location.reload()}>&times;</button>
            <p>
              You have received a new order from {latestNotification.order.customerName}. Check below for more details.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationBar;
