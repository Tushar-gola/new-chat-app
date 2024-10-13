
import io from 'socket.io-client';
export const socket = io(import.meta.env.VITE_BASE_URL, { autoConnect: false, auth: { user: "" } });

socket.onAny((event, ...args) => {
    console.log(event, 'Socket', args);
});