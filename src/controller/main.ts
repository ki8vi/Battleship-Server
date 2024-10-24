import { RawData, WebSocket } from "ws";
import { deserialize } from "../helpers/deserialize";
import { regHandler } from "../handlers/regHandler";

const mainConstroller = (dataInput: RawData, server: WebSocket) => {
    const parsedReq = deserialize(dataInput);
    const { type, data } = parsedReq;
    switch(type) {
        case 'reg':
            return regHandler(parsedReq, server);
        default:
            
    }
}

export default mainConstroller;