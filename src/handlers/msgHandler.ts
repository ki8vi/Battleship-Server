import { RawData, WebSocket } from 'ws';
import { deserialize } from '../helpers/deserialize';
import { printData } from './printToLog';
import { RegData } from '../types/data';
import { msgSender } from './msgSender';

const players: RegData[] = [];

export const socketHandler = (data: RawData, server: WebSocket): void => {
  const parsedData = deserialize<RegData>(data);
  players.push(parsedData);
  printData<RegData>(parsedData);
  msgSender(parsedData, server);
};
