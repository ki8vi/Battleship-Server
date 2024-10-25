import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';
import CONSTANTS from '../constants';
import Players from '../store/players';
import { GameRoom, RoomPlayer } from '../types/data';
import gameRooms from '../store/rooms';
import SocketStore from '../store/sokets';

const players = Players.getInstance();
const sockets = SocketStore.getInstance();

const updateRoom = (server: WebSocket): void => {
    console.log(players.getPlayers())
    const myIndex = players.getMyIndex();
    
    if (myIndex !== null) {
        const mePlayer = players.getPlayers()[myIndex];
        
        const roomId = randomUUID();
        const roomPlayer: RoomPlayer = { name: mePlayer.name, index: myIndex };
        const room: GameRoom = { roomId, roomUsers: [roomPlayer] };

        gameRooms.push(room);
        
        const dataOut: GameRoom[] = gameRooms;
        const updRoomOut = {
            type: CONSTANTS.UPDATE_ROOM,
            data: JSON.stringify(dataOut),
            id: 0,
        };
        console.log(updRoomOut)
        server.send(JSON.stringify(updRoomOut));
        console.log(`Room created: ${roomId} with player ${mePlayer.name}`);
    }
};

export default updateRoom;
