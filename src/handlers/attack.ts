import { WebSocket } from "ws";
import getMe from "../helpers/getMe";
import Game from "../store/game";
import turn from "./turn";
import updateAttack from "../helpers/udateAttack";
import getCells from "../helpers/getCells";
import determineNearCells from "../helpers/determineCellsNear";
import { Status } from "../types/data";
import checkForWinner from "../helpers/winner";

const gameOptions = Game.getInstance();


const attack = (data: string, server: WebSocket): Status | null => {
    const me = getMe(server);
    const myGameOptions = gameOptions.getPlayersOptions();
    const parsedData = JSON.parse(data);
    const { gameId, x, y, indexPlayer } = parsedData;
    const currrTurn = gameOptions.getTurn();

    if (indexPlayer !== currrTurn || myGameOptions.gameId !== gameId) return null;

    if (me && !gameOptions.hasShoot(me.id, x, y)) {
        const allPlayersShips = gameOptions.getAllPlayerShips();
        let status: Status = 'miss';
        let enemyShips;
        let enemyId: string | null = null;

        for (const [id, ships] of allPlayersShips) {
            if (id !== me.id) {
                enemyShips = ships;
                enemyId = id;
            }
        }

        if (enemyShips && enemyId) {
            for (const ship of enemyShips) {
                const occupiedCells = getCells(ship.position, ship.length, ship.direction);
                const shipX = ship.position.x;
                const shipY = ship.position.y;

                ship.hit = ship.hit || 0;

                if (!ship.direction && y === shipY && x >= shipX && x < shipX + ship.length) {
                    ship.hit += 1;
                    status = ship.hit === ship.length ? 'killed' : 'shot';
                    updateAttack({ x, y }, me.id, enemyId as string, 'shot');

                    if (status === 'killed') {
                        for (const cell of occupiedCells) {
                            updateAttack(cell, me.id, enemyId as string, 'killed');
                        }
                        determineNearCells(occupiedCells, me.id, enemyId as string);
                    }
                    break;
                }
                else if (ship.direction && x === shipX && y >= shipY && y < shipY + ship.length) {
                    ship.hit += 1;
                    status = ship.hit === ship.length ? 'killed' : 'shot';
                    updateAttack({ x, y }, me.id, enemyId as string, 'shot');

                    if (status === 'killed') {
                        for (const cell of occupiedCells) {
                            updateAttack(cell, me.id, enemyId as string, 'killed');
                        }
                        determineNearCells(occupiedCells, me.id, enemyId as string);
                    }
                    break;
                }
            }

            if (status === 'miss') {
                updateAttack({ x, y }, me.id, enemyId as string, status);
            }

            gameOptions.addShoot(me.id, x, y);

            turn(server, status === 'miss' ? enemyId : me.id);

            checkForWinner(enemyShips, me.id, [me.id, enemyId]);
            return status;
        }
    }
    return null;
};

export default attack;





