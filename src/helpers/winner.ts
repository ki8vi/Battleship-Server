import { WebSocket } from "ws";
import SocketStore from "../store/sokets";
import { Ships } from "../types/data";
import updateWinners from "./updateWinners";
import updateRoom from "../handlers/updateRoom";
import Players from "../store/players";
import Game from "../store/game";
import CONSTANTS from "../constants";

const sockets = SocketStore.getInstance();
const players = Players.getInstance();
const gameOptions = Game.getInstance();

const checkForWinner = (enemyShips: Ships[], winnerId: string, playersIds: string[]): void => {
    const killedShipsCount = enemyShips.filter((ship) => ship.hit === ship.length).length;
    const totalShipsCount = enemyShips.length;

    if (killedShipsCount === totalShipsCount && players.addWin(winnerId)) {
        gameOptions.resetGame();
        const finishOut = {
            type: CONSTANTS.FINISH,
            data: JSON.stringify({ winPlayer: winnerId }),
            id: 0,
        };
        playersIds.forEach((plId) => {
            const currSocket = sockets.getSocket(plId);
            if(currSocket?.readyState === WebSocket.OPEN) {
                currSocket.send(JSON.stringify(finishOut));
            }
        });
        sockets.sendToSockets(updateWinners);
        sockets.sendToSockets(updateRoom);
    }
};

export default checkForWinner;