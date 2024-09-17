// server/plugins/websocket.ts

import { Server } from 'http'
import WebSocket from 'ws'
import { defineNitroPlugin } from 'nitropack/runtime/plugin'

let wss: WebSocket.Server | null = null

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    if (!wss) {
      const server = new Server()
      wss = new WebSocket.Server({ server })

      wss.on('connection', (ws) => {
        console.log('New client connected')

        ws.on('message', (message) => {
          console.log('Received message:', message.toString())
        })

        ws.on('close', () => {
          console.log('Client disconnected')
        })

        ws.on('error', (error) => {
          console.error('WebSocket error:', error)
        })
      })

      server.listen(8787, () => {
        console.log('=> WebSocket server started on port 8787')
      })
    }
  })
})

// Функция для отправки сообщений всем клиентам
export function broadcastMessage(message: string) {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  }
}


// import { initializeWebSocket } from '../websocket';

// export default defineNitroPlugin(() => {
//   // Инициализируем WebSocket сервер при старте
//   initializeWebSocket();
// });
