import { socketHandler } from '../handlers/msgHandler';
import { deserialize } from '../helpers/deserialize'
import { WebSocketServer } from 'ws';

export const startSocket = (port: number) => {
    const socket = new WebSocketServer({ port });

    socket.on('connection', (server) => {
        console.log('Socket Connected');
        server.on('message', (data) => { socketHandler(data, server) });
        server.on('error', console.error);
        server.on('close', () => {
            console.log('Socket Disconnected');
        });

        
    });

    console.log(`Socket running on server://localhost:${port}`);
};

