import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { useRuntimeConfig } from '#imports';

let wss: WebSocketServer | null = null;

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig();

  const wsServer = http.createServer();
  wss = new WebSocketServer({ server: wsServer });

  wsServer.listen(8787, () => {
    console.log('WebSocket server started on port 8787');
  });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log('Received:', message.toString());
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
});


export const broadcastMessage=(message: string)=> {
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }