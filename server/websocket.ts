import WebSocket from 'ws';

let webSocketServer: WebSocket.Server | undefined;
let socketIsRun = false;

export function initializeWebSocket() {
  if (!socketIsRun) {
    const wss = new WebSocket.Server({ port: 8787 });

    wss.on('connection', (ws) => {
      console.log('New client connected');

      ws.on('message', (message) => {
        console.log('Received message:', message);
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });

    console.log('=> WebSocket server started on port 8787');
    webSocketServer = wss;
    socketIsRun = true;
  }
  return webSocketServer;
}

export function broadcastMessage(message: string) {
  if (webSocketServer) {
    webSocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
