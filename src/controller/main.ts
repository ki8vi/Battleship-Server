import { RawData, WebSocket } from "ws";
import { deserialize } from "../helpers/deserialize";
import { regHandler } from "../handlers/regHandler";
import CONSTANTS from "../constants";
import updateWinners from "../helpers/updateWinners";
import updateRoom from "../handlers/updateRoom";
import addUserToRoom from "../handlers/addToRoom";
import SocketStore from "../store/sokets";

const sockets = SocketStore.getInstance();


const mainConstroller = (dataInput: RawData, server: WebSocket) => {
    const parsedReq = deserialize(dataInput);
    const { type, data } = parsedReq;
    switch(type) {
        case CONSTANTS.REG:
            regHandler(parsedReq, server);
            sockets.sendToSockets(updateWinners);
            break;
        case CONSTANTS.CREATE_ROOM:
            // updateRoom(server);
            sockets.sendToSockets(updateWinners);
            break;
        case CONSTANTS.ADD_USER_TO_ROOM:
            // addUserToRoom(server, data.indexRoom)
            // updateRoom(server);
            break;
        default:
            console.log('from default of controller', type)

    }
    // console.log(`Socket output => ${type}: ${parsedData}`)
    console.log(parsedReq)
}

export default mainConstroller;