import { WebSocket } from "ws";
import CONSTANTS from "../constants";
import Game from "../store/game";
import SocketStore from "../store/sokets";
import getMe from "../helpers/getMe";

const gameOptions = Game.getInstance();
const sockets = SocketStore.getInstance();

const turn = (server: WebSocket, turnId: string) => {
    gameOptions.setTurn(turnId);

    const me = getMe(server);
    if(me) {

        const allPlayersShips = gameOptions.getAllPlayerShips();
        let enemyId;
        for(const [id] of allPlayersShips) {
            if(id !== me.id) {
                enemyId = id;
            }
        }
        const meSocket = sockets.getSocket(me.id);
        const enemySocket = sockets.getSocket(enemyId as string);
        const turnOut = {
            type: CONSTANTS.TURN,
            data: JSON.stringify({ currentPlayer: turnId }),
            id:0
        };
    
        [meSocket, enemySocket].forEach((skt) => {
            if(skt && skt.readyState === WebSocket.OPEN) {
                skt.send(JSON.stringify(turnOut));
            }
        });
    }

}

export default turn;