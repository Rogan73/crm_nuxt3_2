import { ref } from 'vue';

interface WebSocketReturn {
  messages: Ref<string[]>; 
  socket: WebSocket | null;
}

export default function InitWebSocket(): WebSocketReturn {
  const messages = ref<string[]>([]);  
  let socket: WebSocket | null = null; 

  socket = new WebSocket('ws://localhost:8787'); 

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onmessage = (event: MessageEvent) => {
    const message = event.data as string;
    console.log('Received message:', message);
    messages.value.push(message);
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };

  socket.onerror = (error: Event) => {
    console.error('WebSocket error:', error);
  };

  return { messages, socket };
}
