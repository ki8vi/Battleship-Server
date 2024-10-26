import { WebSocket } from "ws";
import Game from "../store/game";
import SocketStore from "../store/sokets";
import Players from "../store/players";
import CONSTANTS from "../constants";

const sockets = SocketStore.getInstance()
const gameOptions = Game.getInstance();
const players = Players.getInstance();

const addShips = (data: string, server: WebSocket) => {
    const parsedData = JSON.parse(data);
    const inputGameId = parsedData.gameId;
    const myGameOptions = gameOptions.getPlayersOptions();
    const mePlayer = players.getPlayers().find((pl) => pl.id === parsedData.indexPlayer);
    const ships = parsedData.ships;


    if(inputGameId === myGameOptions.gameId) {

        const meId = myGameOptions.meId;
        const enemyId = myGameOptions.enemyId;
        if(meId === parsedData.indexPlayer) {
            console.log('may name is ', players.getPlayers().find((pl) => pl.id === meId)?.name)
            gameOptions.setShips(meId, ships);
        }
        if(enemyId === parsedData.indexPlayer) {
            console.log('enemy name is ', players.getPlayers().find((pl) => pl.id === enemyId)?.name)
            gameOptions.setShips(enemyId, ships);
        }
        
        if(gameOptions.getShips(meId)?.length && gameOptions.getShips(enemyId)?.length) {
            const mySocket = sockets.getSocket(meId);
            if(mySocket && mySocket.readyState === WebSocket.OPEN) {
                console.log('my socket')
                const shipsOut = {
                    type: CONSTANTS.START_GAME,
                    data: JSON.stringify({ ships, currentPlayerIndex: meId }),
                    id: 0
        
                }
                mySocket.send(JSON.stringify(shipsOut));
            }
            const enemySocket = sockets.getSocket(enemyId);
            if(enemySocket && enemySocket.readyState === WebSocket.OPEN) {
                console.log('enemy socket')
                const shipsOut = {
                    type: CONSTANTS.START_GAME,
                    data: JSON.stringify({ ships, currentPlayerIndex: enemyId }),
                    id: 0
        
                }
                enemySocket.send(JSON.stringify(shipsOut));
            }
        }


        
        // console.log('add ships: ', mePlayer?.name, ships);
    }
}


export default addShips;
