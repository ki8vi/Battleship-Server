import { RegData } from '../types/data';
import { WebSocket } from 'ws';

export const msgSender = (req: RegData, server: WebSocket): void => {
  const { type } = req;
  const dataToSend =  {
    index: 0,
    error: false,
    errorText: 'hzasdasd',
  }
  switch (type) {
    case 'reg':
        return server.send(JSON.stringify({ type, data: JSON.stringify(dataToSend), id: 0 }));
  }
};
