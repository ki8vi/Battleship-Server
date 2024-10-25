import { WebSocket } from "ws";
import Players from "../store/players";
import CONSTANTS from "../constants";

const players = Players.getInstance();

const updateWinners = (server: WebSocket): void => {
  const winnerOut = {
    type: CONSTANTS.UPDATE_WINNERS,
    data: JSON.stringify(players.takeWinners()),
    id: 0,
  };
  server.send(JSON.stringify(winnerOut));
};

export default updateWinners;
