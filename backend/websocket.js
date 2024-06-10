// websocket.js
import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('close', (code, reason) => {
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`);
  });

  ws.on('message', (message) => {
    console.log('Received message:', message);
  });
});

export const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};
