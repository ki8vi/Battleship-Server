import mainConstroller from '../controller/main';
import { WebSocketServer } from 'ws';
import SocketStore from '../store/sokets';
import RoomsStore from '../store/rooms';
import updateRoom from '../handlers/updateRoom';
import Players from '../store/players';
import updateWinners from '../helpers/updateWinners';

const socketsMap = SocketStore.getInstance();
const rooms = RoomsStore.getInstance();
const players = Players.getInstance();

export const startSocket = (port: number) => {
    const socket = new WebSocketServer({ port });

    socket.on('connection', (server) => {
        console.log('Socket Connected');
     
        server.on('message', (data) => { 
            mainConstroller(data, server);
            // socketsMap.sendToSockets(updateRoom);
            // socketsMap.sendToSockets(updateWinners);
        });
        
        server.on('close', () => {
            const plId = socketsMap.getIdBySocket(server);
            const player = players.getPlayers().find((pl) => pl.id === plId);
            if (plId && player) {
                socketsMap.deleteSocket(plId);
                rooms.deleteRoomsWithPlayers([plId])
                socketsMap.sendToSockets(updateRoom)
                console.log(`Socket for ${player.name} disconnected`);
            }
        });
        
        server.on('error', console.error);
    });

    console.log(`Socket running on port: ${port}`);
};

