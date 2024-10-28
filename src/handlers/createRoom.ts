import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';
import { GameRoom, RoomPlayer } from '../types/data';
import RoomsStore from '../store/rooms';
import getMe from '../helpers/getMe';

const roomStore = RoomsStore.getInstance();

const createRoom = (server: WebSocket): void => {
    const me = getMe(server);
    if (me) {
        const isMeInRoom = roomStore.getAllRooms().some((room) => room.roomUsers.some((user) => user.index === me.id));
        
        if(!isMeInRoom) {
            const roomPlayer: RoomPlayer = { name: me.name, index: me.id }
            const roomId = randomUUID();
            const newRoom: GameRoom = { roomId, roomUsers: [roomPlayer] };
            roomStore.addNewRoom(newRoom);
        } else {
            console.log(`${me.name} IN ROOM!`);
        }
    }
};

export default createRoom;

