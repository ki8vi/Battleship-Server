import { randomUUID } from "crypto";
import sendRegOut from "../helpers/sendReg";
import Players from "../store/players";
import SocketStore from "../store/sokets";
import { Player, BaseData } from "../types/data";
import { WebSocket } from "ws";

const players = Players.getInstance();
const sockets = SocketStore.getInstance();

const regPlayer = (req: BaseData, server: WebSocket): void => {
  const { type, data } = req;
  const parsedData = JSON.parse(data);
  const id = randomUUID();
  const currPlayer: Player = {
    name: parsedData.name,
    password: parsedData.password,
    id,
    wins: 0,
  };
  if (!players.checkPlayerByName(currPlayer)) {
    players.addPlayer(currPlayer);
    players.setMyId(currPlayer.id);
    sockets.setSocket(currPlayer.id, server);
    sendRegOut(
      server,
      type,
      currPlayer,
      currPlayer.id,
      false
    );
   
  } else {
    const existPlayerId = players.getPlayers().find((pl) => pl.name === currPlayer.name)?.id;
    if(existPlayerId) {
      const existSocket = sockets.getSocket(existPlayerId);
      if(existSocket && existSocket.readyState === WebSocket.OPEN) {
        sendRegOut(
          server,
          type,
          currPlayer,
          currPlayer.id,
          true,
          "User already logged in from another tab!"
        );
        return;
      } else {
        sockets.setSocket(existPlayerId, server);
      }
    }
    if(players.checkPassword(currPlayer)) {
      sockets.setSocket(currPlayer.id, server);

      sendRegOut(
        server,
        type,
        currPlayer,
        currPlayer.id,
        false
      );
    } else {
      sendRegOut(
        server,
        type,
        currPlayer,
        currPlayer.id,
        true,
        "The password is incorrect!"
      );
    }
  }
};

export default regPlayer;
