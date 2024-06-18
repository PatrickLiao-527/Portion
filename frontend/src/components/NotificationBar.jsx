import React, { useContext, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext'; // Adjust the import path as needed
import '../assets/styles/NotificationBar.css'; // Ensure you have the appropriate CSS file

const NotificationBar = () => {
  const { notifications, socket } = useContext(WebSocketContext);
  const latestNotification = notifications[notifications.length - 1];

  useEffect(() => {
    if (latestNotification) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        if (latestNotification.type === 'NEW_ORDER') {
          socket.send(JSON.stringify({
            type: 'NOTIFICATION_RECEIVED',
            message: `New order from ${latestNotification.order.customerName}`
          }));
        } else if (latestNotification.type === 'ORDER_CANCELLED') {
          socket.send(JSON.stringify({
            type: 'NOTIFICATION_RECEIVED',
            message: `Order from ${latestNotification.order.customerName} has been cancelled`
          }));
        }
      }
    }
  }, [latestNotification, socket]);

  return (
    <>
      {latestNotification && latestNotification.type === 'NEW_ORDER' && (
        <div className="notification-bar new-order">
          <div className="notification-content">
            <button className="close-button" onClick={() => window.location.reload()}>&times;</button>
            <p>
              You have received a new order from {latestNotification.order.customerName}. Check below for more details.
            </p>
          </div>
        </div>
      )}
      {latestNotification && latestNotification.type === 'ORDER_CANCELLED' && (
        <div className="notification-bar order-cancelled">
          <div className="notification-content">
            <button className="close-button" onClick={() => window.location.reload()}>&times;</button>
            <p>
              Order from {latestNotification.order.customerName} has been cancelled.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationBar;
