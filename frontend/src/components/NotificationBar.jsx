import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../WebSocketContext';
import '../assets/styles/NotificationBar.css';

const NotificationBar = () => {
  const [notification, setNotification] = useState(null);
  const socket = useWebSocket();

  useEffect(() => {
    if (socket) {
      console.log("WebSocket connected in NotificationBar");
      socket.onmessage = (event) => {
        console.log('Notification has received socket message');
        const data = JSON.parse(event.data);
        console.log("Notification bar received message:", data);
        if (data.type === 'NEW_ORDER') {
          setNotification(`New order received: ${data.order.mealName} - $${data.order.amount}`);
          console.log("Notification set:", `New order received: ${data.order.mealName} - $${data.order.amount}`);
        }
      };
      socket.onclose = (event) => {
        console.log('WebSocket closed:', event);
      };
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } else {
      console.log("WebSocket not available in NotificationBar");
    }
  }, [socket]);

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    notification && (
      <div className="notification-bar">
        <div className="notification-content">
          {notification}
          <button className="notification-close-button" onClick={closeNotification}>
            &times;
          </button>
        </div>
      </div>
    )
  );
};

export default NotificationBar;
