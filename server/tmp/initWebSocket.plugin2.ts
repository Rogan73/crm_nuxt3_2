import { WebSocketServer } from 'ws';

const clients: Set<WebSocket> = new Set();

export default async function StartWebSocketServer () {
  // Создаем WebSocket сервер на порту 8787
  const wss = new WebSocketServer({ port: 8787 });

  wss.on('connection', (ws: WebSocket) => {
    clients.add(ws);

    ws.on('message', (message: string) => {
      console.log('received: %s', message);
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Используем глобальный хук для отправки сообщений
  globalThis.$sendWebSocketMessage = (message: string) => {
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  };

  console.log('WebSocket server is running on ws://localhost:8787');
};

// server/api/send-message.ts
export const  defineEventHandler=(async (event) => {
    const body = await readBody(event);
    const message = body.message;
  
    // Вызываем глобальную функцию для отправки сообщения всем WebSocket клиентам
    globalThis.$sendWebSocketMessage(message);
  
    return { status: 'Message sent to all clients' };
  });
  