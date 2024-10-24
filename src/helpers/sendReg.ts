import { Player } from "../types/data";
import { WebSocket } from 'ws';

const sendRegOut = (server: WebSocket, type: string, currPlayer: Player, index: number, error: boolean, errorText: string = '', id: number = 0): void => {
    const regOutput = {
      type,
      data: JSON.stringify({ ...currPlayer, index, error, errorText }),
      id
    };
    server.send(JSON.stringify(regOutput));
};

export default sendRegOut;