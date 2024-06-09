import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthContext';
import { WebSocketProvider } from './WebSocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </AuthProvider>
);
