import mainConstroller from '../controller/main';
import { WebSocketServer } from 'ws';
import SocketStore from '../store/sokets';
import RoomsStore from '../store/rooms';
import updateRoom from '../handlers/updateRoom';
import Players from '../store/players';
import updateWinners from '../helpers/updateWinners';
import disconnectedPlayer from '../helpers/desconnectedPlayer';

const socketsMap = SocketStore.getInstance();
const rooms = RoomsStore.getInstance();
const players = Players.getInstance();

export const startSocket = (port: number) => {
    const socket = new WebSocketServer({ port });

    socket.on('connection', (server) => {
        console.log('CONNECTED...');
     
        server.on('message', (data) => { 
            mainConstroller(data, server);
        });
        
        server.on('close', () => {
            const plId = socketsMap.getIdBySocket(server);
            const player = players.getPlayers().find((pl) => pl.id === plId);
            if (plId && player) {
                disconnectedPlayer(plId)
                socketsMap.deleteSocket(plId);
                rooms.deleteRoomsWithPlayers([plId])
                socketsMap.sendToSockets(updateRoom);
                socketsMap.sendToSockets(updateWinners);
                console.log(`${player.name} DISCONNECTED...`);
            }
        });
        
        server.on('error', console.error);
    });

    console.log(`SOCKET INIT: ${port}`);
};

