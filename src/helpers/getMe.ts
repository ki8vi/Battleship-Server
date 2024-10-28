import { WebSocket } from "ws";
import Players from "../store/players";
import SocketStore from "../store/sokets";
import { Player } from "../types/data";

const players = Players.getInstance();
const sockets = SocketStore.getInstance();

const getMe = (server: WebSocket): Player | null | undefined => {
    const idBySocket = sockets.getIdBySocket(server);
    return idBySocket ? players.getPlayers().find((pl) => pl.id === idBySocket) : null;
}

export default getMe;