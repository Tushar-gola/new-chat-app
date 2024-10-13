
import io from 'socket.io-client';
export const socket = io(import.meta.env.VITE_BASE_URL, { autoConnect: false, auth: { user: "" } ,transports: ['websocket']});

socket.onAny((event, ...args) => {
    console.log(event, 'Socket', args);
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
    console.log(`Disconnected: ${reason}`);
});

socket.on('reconnect_attempt', (attempt) => {
    console.log(`Reconnecting attempt: ${attempt}`);
});

socket.on('reconnect', (attempt) => {
    console.log(`Reconnected after ${attempt} attempts`);
});

socket.on('reconnect_failed', () => {
    console.log('Reconnection failed');
});