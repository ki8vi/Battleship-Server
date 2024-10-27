import { RawData, WebSocket } from "ws";
import { deserialize } from "../helpers/deserialize";
import regPlayer from "../handlers/reg";
import CONSTANTS from "../constants";
import createRoom from "../handlers/createRoom";
import createGame from "../handlers/createGame";
import addShips from "../handlers/addShips";
import SocketStore from "../store/sokets";
import updateRoom from "../handlers/updateRoom";
import updateWinners from "../helpers/updateWinners";
import attack from "../handlers/attack";
import randomAttack from "../handlers/randomAttack";
import singlePlay from "../handlers/singlePlay";

const socketsMap = SocketStore.getInstance();

const mainConstroller = (dataInput: RawData, server: WebSocket) => {
    const parsedReq = deserialize(dataInput);
    const { type, data } = parsedReq;
    console.log('main: controller: ',parsedReq);
    switch(type) {
        case CONSTANTS.REG:
            regPlayer(parsedReq, server);
            socketsMap.sendToSockets(updateRoom);
            socketsMap.sendToSockets(updateWinners);
            break;
        case CONSTANTS.CREATE_ROOM:
            createRoom(server);
            socketsMap.sendToSockets(updateRoom);
            break;
        case CONSTANTS.ADD_USER_TO_ROOM:
            createGame(data, server);
            break;
        case CONSTANTS.ADD_SHIPS:
            addShips(data, server);
            break;
        case CONSTANTS.ATTACK:
            attack(data, server);
            break;
        case CONSTANTS.RANDOM_ATTACK:
            randomAttack(data, server);
            break;
        case CONSTANTS.SINGLE_PLAY:
            // singlePlay(data, server);
            break;
        default:
            console.log('from default of controller', type)

    }
    // console.log(`Socket output => ${type}: ${parsedData}`)
}

export default mainConstroller;
