import fs from 'fs';
import https from 'https';
import WebSocket, { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Path to your SSL certificate files
const certPath = '/home/portion/.certs';
// Read the SSL certificate files
const serverOptions = {
  cert: fs.readFileSync(path.join(certPath, 'fullchain1.pem')),
  key: fs.readFileSync(path.join(certPath, 'privkey1.pem'))
};
// Create an HTTPS server
const server = https.createServer(serverOptions);

// Create a WebSocket server attached to the HTTPS server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  //console.log('WebSocket Server: New client connected');

  ws.on('close', (code, reason) => {
    //console.log(`WebSocket Server: Client disconnected. Code: ${code}, Reason: ${reason}`);
  });

  ws.on('message', (message) => {
    //console.log('WebSocket Server: Received message:', message);
  });
});

export const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

server.listen(8080, () => {
  //console.log('WebSocket Server is running on port 8080');
});