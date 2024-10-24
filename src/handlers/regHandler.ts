import sendRegOut from '../helpers/sendReg';
import Players from '../playersStore/players';
import { Player, RegData } from '../types/data';
import { WebSocket } from 'ws';

const players = Players.getInstance();

export const regHandler = (req: RegData, server: WebSocket): void => {
  const { type, data, id } = req;
  const parsedData = JSON.parse(data);
  const currPlayer: Player = { name: parsedData.name, password: parsedData.password };
  if(!players.checkPlayerByName(currPlayer)) {
    players.addPlayer(currPlayer);
    sendRegOut(server, type, currPlayer, players.getPlayerIndex(currPlayer), false);
  } else {
    if(players.checkPassword(currPlayer)) {
      sendRegOut(server, type, currPlayer, players.getPlayerIndex(currPlayer), false);
    } else {
      sendRegOut(server, type, currPlayer, players.getPlayerIndex(currPlayer), true, 'The password is incorrect!');
    }
  }
  console.log(`Socket output => ${type}: ${JSON.stringify(currPlayer)}`)
  console.log(players.getPlayers())
};
