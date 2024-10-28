import { WebSocket } from "ws";
import CONSTANTS from "../constants";
import Players from "../store/players";
import SocketStore from "../store/sokets";
import Game from "../store/game";

const sockets = SocketStore.getInstance();
const players = Players.getInstance();
const gameOptions = Game.getInstance();

const disconnectedPlayer = (playerId: string): void => {
    const options = gameOptions.getPlayersOptions();
    for(const [key, val] of Object.entries(options)) {
        if(val !== playerId && key !== 'gameId') {
            const winnerSocket = sockets.getSocket(val);
            if(winnerSocket?.readyState === WebSocket.OPEN && players.addWin(val)) {
                const finishOut = {
                    type: CONSTANTS.FINISH,
                    data: JSON.stringify({ winPlayer: val }),
                    id: 0,
                };
                winnerSocket.send(JSON.stringify(finishOut));
            }
        }
    }
}

export default disconnectedPlayer;