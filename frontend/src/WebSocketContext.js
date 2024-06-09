import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);

  const socket = useMemo(() => new WebSocket('ws://localhost:8080'), []);

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        console.log('Connected to WebSocket server');
        setWs(socket);
      };

      socket.onmessage = (message) => {
        console.log('WebSocket message received:', message);
        // Handle incoming messages here
      };

      socket.onclose = (event) => {
        console.log('Disconnected from WebSocket server');
        console.log(`Code: ${event.code}, Reason: ${event.reason}`);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        if (socket.readyState === 1) { // Check if socket is open
          socket.close();
        }
      };
    }
  }, [socket]);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};
