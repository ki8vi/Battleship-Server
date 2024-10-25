import sendRegOut from "../helpers/sendReg";
import Players from "../store/players";
import SocketStore from "../store/sokets";
import { Player, BaseData } from "../types/data";
import { WebSocket } from "ws";

const players = Players.getInstance();
const sockets = SocketStore.getInstance();

export const regHandler = (req: BaseData, server: WebSocket): void => {
  const { type, data } = req;
  const parsedData = JSON.parse(data);
  const currPlayer: Player = {
    name: parsedData.name,
    password: parsedData.password,
    wins: 0,
  };
  if (!players.checkPlayerByName(currPlayer)) {
    players.addPlayer(currPlayer);
    players.setMyIndex(currPlayer);
    sockets.setSocket(currPlayer.name, server);
    sendRegOut(
      server,
      type,
      currPlayer,
      players.getPlayerIndex(currPlayer),
      false
    );
  } else {

    const existSocket = sockets.getSocket(currPlayer.name);
    
    if (existSocket) {
      sendRegOut(
        server,
        type,
        currPlayer,
        players.getPlayerIndex(currPlayer),
        true,
        "User already logged in from another tab!"
      );
      return;
    }


    if (players.checkPassword(currPlayer)) {
      sockets.setSocket(currPlayer.name, server);

      sendRegOut(
        server,
        type,
        currPlayer,
        players.getPlayerIndex(currPlayer),
        false
      );
    } else {
      sendRegOut(
        server,
        type,
        currPlayer,
        players.getPlayerIndex(currPlayer),
        true,
        "The password is incorrect!"
      );
    }
  }
  console.log(`Socket output => ${type}: ${JSON.stringify(currPlayer)}`);


  server.on('close', () => {
    const playerName = parsedData.name;
    if (playerName) {
        sockets.deleteSocket(playerName);
        console.log(`Socket for ${playerName} disconnected`);
    }
});
};
