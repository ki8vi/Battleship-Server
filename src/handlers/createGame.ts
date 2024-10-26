import RoomsStore from "../store/rooms";
import CONSTANTS from "../constants";
import SocketStore from "../store/sokets";
import Game from "../store/game";
import { WebSocket } from "ws";
import getMe from "../helpers/getMe";


const roomsStore = RoomsStore.getInstance();
const socketStore = SocketStore.getInstance();
const gameoptionsStore = Game.getInstance();

const createGame = (data: string, server: WebSocket): void => {
    const me = getMe(server);
    if (me) {
        const indexRoom = JSON.parse(data).indexRoom;
        const targetRoom = roomsStore.getRoomById(indexRoom);
        const isAlreadyInRoom = targetRoom && targetRoom.roomUsers.some((user) => user.index === me.id);

        if (targetRoom && !isAlreadyInRoom) {
            if (targetRoom.roomUsers.length < 2) {
                roomsStore.addPlayerToRoom(indexRoom, { name: me.name, index: me.id });

                if (targetRoom.roomUsers.length === 2) {
                    const idGame = gameoptionsStore.getPlayersOptions().gameId;
                    const enemy = targetRoom.roomUsers.find((user) => user.index !== me.id);

                    if(enemy && enemy.index) {
                        const enemySocket = socketStore.getSocket(enemy.index as string);
                        if(enemySocket?.readyState === WebSocket.OPEN && server.readyState === WebSocket.OPEN) {
                            gameoptionsStore.setPlayersOptions(me.id, enemy.index as string);
                            const enemyOut = {
                                type: CONSTANTS.CREATE_GAME,
                                data: JSON.stringify({ idGame, idPlayer: enemy.index }),
                                id: 0,
                            };
                            enemySocket?.send(JSON.stringify(enemyOut));
        
                            const meOut = {
                                type: CONSTANTS.CREATE_GAME,
                                data: JSON.stringify({ idGame, idPlayer: me.id }),
                                id: 0,
                            };
                            server.send(JSON.stringify(meOut));
        
                            roomsStore.deleteRoomsWithPlayers([me.id, enemy.index as string]);
                        }
                    }
                }
            } else {
                console.log('You cannot play with yourself or you are already in the room!');
            }
        } else {
            console.log('You cannot play with yourself or you are already in the room!');
        }
    }
};


export default createGame;