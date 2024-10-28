import { WebSocket } from "ws";
import Game from "../store/game";
import { Position } from "../types/data";
import attack from "./attack";
import getMe from "../helpers/getMe";
import getNewPos from "./getNewPosition";

const gameOptions = Game.getInstance();
const previousHits: Position[] = [];

const randomAttack = (data: string, server: WebSocket) => {
    const me = getMe(server);
    const { gameId, indexPlayer } = JSON.parse(data);
    const currrTurn = gameOptions.getTurn();
    
    if (!me || indexPlayer !== currrTurn || gameOptions.getPlayersOptions().gameId !== gameId) return;

    let coordinates: Position | null = null;

    if (previousHits.length > 0) {
        const lastShoot = previousHits[previousHits.length - 1];
        const possibleShoots = [
            { x: lastShoot.x + 1, y: lastShoot.y },
            { x: lastShoot.x - 1, y: lastShoot.y },
            { x: lastShoot.x, y: lastShoot.y + 1 },
            { x: lastShoot.x, y: lastShoot.y - 1 },
        ];

        for (const target of possibleShoots) {
            if (
                target.x >= 0 && target.x < 10 &&
                target.y >= 0 && target.y < 10 &&
                !gameOptions.hasShoot(me.id, target.x, target.y)
            ) {
                coordinates = target;
                break;
            }
        }
    }

    if (!coordinates) {
        coordinates = getNewPos(me.id);
    }

    const dataString = JSON.stringify({
        gameId,
        x: coordinates.x,
        y: coordinates.y,
        indexPlayer
    });

    const attackStatus = attack(dataString, server);

    if (attackStatus === 'shot') {
        previousHits.push(coordinates);
    } else if (attackStatus === 'killed') {
        previousHits.length = 0;
    }
};

export default randomAttack;


