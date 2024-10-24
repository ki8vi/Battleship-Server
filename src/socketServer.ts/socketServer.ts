import mainConstroller from '../controller/main';
import { WebSocketServer } from 'ws';

export const startSocket = (port: number) => {
    const socket = new WebSocketServer({ port });

    socket.on('connection', (server) => {
        console.log('Socket Connected');
        server.on('message', (data) => { mainConstroller(data, server) });
        server.on('error', console.error);     
    });

    console.log(`Socket running on port: ${port}`);
};

