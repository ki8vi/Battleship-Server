import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';
import CONSTANTS from '../constants';
import Players from '../store/players';
import { GameRoom, RoomPlayer } from '../types/data';
import RoomsStore from '../store/rooms';

const players = Players.getInstance();
const roomStore = RoomsStore.getInstance();

const createRoom = (server: WebSocket): void => {
    const myIndex = players.getMyIndex();
    if (myIndex !== null) {
        const mePlayer = players.getPlayers()[myIndex];
        const isMeInRoom = roomStore.getAllRooms().some((room) => room.roomUsers.some((user) => user.name === mePlayer.name));
        if(!isMeInRoom) {
            const roomPlayer: RoomPlayer = { name: mePlayer.name, index: myIndex }
            const roomId = randomUUID();
            const newRoom: GameRoom = { roomId, roomUsers: [roomPlayer] };
            roomStore.addNewRoom(newRoom);
            const updRoomOut = {
                type: CONSTANTS.UPDATE_ROOM,
                data: JSON.stringify(roomStore.getAllRooms()),
                id: 0,
            };
            server.send(JSON.stringify(updRoomOut));
        } else {
            console.log(`Player ${mePlayer.name} already in room!`);
        }
    }
};

export default createRoom;

