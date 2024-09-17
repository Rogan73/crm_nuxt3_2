//import { broadcastMessage } from './websocket';
import { broadcastMessage } from '@/server/plugins/initWebSocket.plugin';

export async function updateBoardInDatabase(id: string, data: any) {
    try {
    // Update data to DB


    } catch (error) {
      console.error('Error updating board in database:', error)
      throw error
    }

    const body = `updatedIdBoard=${id}`
    broadcastMessage(JSON.stringify(body));
    console.log('Message sent to all clients');

  }

  
