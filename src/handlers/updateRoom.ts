import { WebSocket } from 'ws';
import CONSTANTS from '../constants';
import RoomsStore from '../store/rooms';

const roomStore = RoomsStore.getInstance();


const updateRoom = (server: WebSocket): void => {
    const roomsWithOnePlayer = roomStore.getRoomsWithOnePlayer();
    const updRoomOut = {
        type: CONSTANTS.UPDATE_ROOM,
        data: JSON.stringify(roomsWithOnePlayer),
        id: 0,
    };
    server.send(JSON.stringify(updRoomOut));
};

export default updateRoom;

