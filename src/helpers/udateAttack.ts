import CONSTANTS from '../constants';
import SocketStore from '../store/sokets';
import { Position, Status } from '../types/data';


const sockets = SocketStore.getInstance();

const updateAttack = (
    position: Position,
    currentPlayerId: string,
    enemyId: string,
    status: Status
) => {
    const attackOut = {
        type: CONSTANTS.ATTACK,
        data: JSON.stringify({
            position,
            currentPlayer: currentPlayerId,
            status,
        }),
        id: 0,
    };

    const currentPlayerSocket = sockets.getSocket(currentPlayerId);
    if (currentPlayerSocket && currentPlayerSocket.readyState === WebSocket.OPEN) {
        currentPlayerSocket.send(JSON.stringify(attackOut));
    }

    const enemySocket = sockets.getSocket(enemyId);
    if (enemySocket && enemySocket.readyState === WebSocket.OPEN) {
        enemySocket.send(JSON.stringify(attackOut));
    }
};

export default updateAttack;