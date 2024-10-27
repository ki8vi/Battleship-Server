import { WebSocket } from "ws";
import Game from "../store/game";
import SocketStore from "../store/sokets";
import Players from "../store/players";
import CONSTANTS from "../constants";
import turn from "./turn";

const sockets = SocketStore.getInstance()
const gameOptions = Game.getInstance();
const players = Players.getInstance();

const addShips = (data: string, server: WebSocket) => {
    const parsedData = JSON.parse(data);
    const inputGameId = parsedData.gameId;
    const myGameOptions = gameOptions.getPlayersOptions();
    const ships = parsedData.ships;
    
    if(inputGameId === myGameOptions.gameId) {

        const meId = myGameOptions.meId;
        const enemyId = myGameOptions.enemyId;
        if(meId === parsedData.indexPlayer) {
            gameOptions.setShips(meId, ships);
        }
        if(enemyId === parsedData.indexPlayer) {
            gameOptions.setShips(enemyId, ships);
        }
        
        if(gameOptions.getShips(meId)?.length && gameOptions.getShips(enemyId)?.length) {
            const mySocket = sockets.getSocket(meId);
            if(mySocket && mySocket.readyState === WebSocket.OPEN) {
                const shipsOut = {
                    type: CONSTANTS.START_GAME,
                    data: JSON.stringify({ ships, currentPlayerIndex: meId }),
                    id: 0
        
                }
                mySocket.send(JSON.stringify(shipsOut));
            }
            const enemySocket = sockets.getSocket(enemyId);
            if(enemySocket && enemySocket.readyState === WebSocket.OPEN) {
                const shipsOut = {
                    type: CONSTANTS.START_GAME,
                    data: JSON.stringify({ ships, currentPlayerIndex: enemyId }),
                    id: 0
        
                }
                enemySocket.send(JSON.stringify(shipsOut));
            }
            turn(server, meId);
        }


        
        // console.log('add ships: ', mePlayer?.name, ships);
    }
}


export default addShips;
