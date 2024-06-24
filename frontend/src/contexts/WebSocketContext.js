// WebSocketContext.jsx
import React, { createContext, useEffect, useState } from 'react';
export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
        const ws = new WebSocket('wss://portion.food:8080');
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, notifications }}>
      {children}
    </WebSocketContext.Provider>
  );
};






