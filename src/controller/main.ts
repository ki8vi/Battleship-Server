import { RawData, WebSocket } from "ws";
import { deserialize } from "../helpers/deserialize";
import { regHandler } from "../handlers/regHandler";
import CONSTANTS from "../constants";
import updateWinners from "../helpers/updateWinners";
import updateRoom from "../handlers/updateRoom";
import SocketStore from "../store/sokets";
import createRoom from "../handlers/createRoom";
import createGame from "../handlers/createGame";

const sockets = SocketStore.getInstance();


const mainConstroller = (dataInput: RawData, server: WebSocket) => {
    const parsedReq = deserialize(dataInput);
    const { type, data } = parsedReq;
    console.log('main: controller: ',parsedReq);
    switch(type) {
        case CONSTANTS.REG:
            regHandler(parsedReq, server);
            sockets.sendToSockets(updateWinners);
            sockets.sendToSockets(updateRoom);
            break;
        case CONSTANTS.CREATE_ROOM:
            createRoom(server);
            sockets.sendToSockets(updateRoom);
            break;
        case CONSTANTS.ADD_USER_TO_ROOM:
            createGame(data);
            sockets.sendToSockets(updateRoom);
            break;
        default:
            console.log('from default of controller', type)

    }
    // console.log(`Socket output => ${type}: ${parsedData}`)
}

export default mainConstroller;