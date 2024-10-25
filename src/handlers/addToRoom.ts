import { WebSocket } from "ws";
import { GameRoom, RoomPlayer } from "../types/data";
import Players from "../store/players";
import gameRooms from "../store/rooms";
import CONSTANTS from "../constants";
import SocketStore from "../store/sokets";

const players = Players.getInstance();
const sockets = SocketStore.getInstance();

const addToRoom = (room: GameRoom, player: RoomPlayer): void => {
    const isPlayerInRoom = room.roomUsers.some((user) => user.name === player.name);
    if (!isPlayerInRoom) {
        room.roomUsers.push(player);
        console.log(`Player ${player.name} added to room ${room.roomId}`);
    } else {
        console.log(`Player ${player.name} is already in room ${room.roomId}`);
    }
};
const addUserToRoom = (server: WebSocket, indexRoom: string | number): void => {
    const myIndex = players.getMyIndex();

    if (myIndex !== null) {
        const mePlayer = players.getPlayers()[myIndex];
        const room = gameRooms.find((r) => r.roomId === indexRoom);

        if (room) {
            addToRoom(room, { name: mePlayer.name, index: myIndex });

            const dataOut = {
                type: CONSTANTS.ADD_USER_TO_ROOM,
                data: JSON.stringify([room]),
                id: 0,
            };

            room.roomUsers.forEach((user) => {
                const socket = sockets.getSocket(user.name);
                if (socket) {
                    socket.send(JSON.stringify(dataOut));
                }
            });
        } else {
            server.send(JSON.stringify({
                type: "error",
                message: "Room not found.",
                id: 0,
            }));
        }
    }
};

export default addUserToRoom;
