import { WebSocket } from "ws";
import { Position, Ships, Status } from "../types/data";
import getCells from "./getCells";
import CONSTANTS from "../constants";
import Bot from "../store/botStore";
import generateRanadomShot from "./randomGenerator";
import getMe from "./getMe";
import updateAttack from "./udateAttack";
import determineNearCells from "./determineCellsNear";
import Game from "../store/game";
import checkForWinner from "./winner";

const botStore = Bot.getInstance();
const gameOpt = Game.getInstance();


export const botAttack = (data: string, server: WebSocket) => {
   
    const me = getMe(server);
    const parsedData = JSON.parse(data);
    const { x, y, indexPlayer } = parsedData;
    let status: Status = 'miss';
    const botShips = botStore.getShips();
    if(botStore.getCurrTurn() !== me?.id) return;
    for (const ship of botShips) {
        const occupiedCells = getCells(ship.position, ship.length, ship.direction);
        const shipX = ship.position.x;
        const shipY = ship.position.y;

        ship.hit = ship.hit || 0;

        if (!ship.direction && y === shipY && x >= shipX && x < shipX + ship.length) {
            ship.hit += 1;
            status = ship.hit === ship.length ? 'killed' : 'shot';
            updateAttack({ x, y }, me?.id as string, 'bot' as string, 'shot');

            if (status === 'killed') {
                for (const cell of occupiedCells) {
                    updateAttack(cell, me?.id as string, 'bot', 'killed');
                }
                determineNearCells(occupiedCells, me?.id as string, 'bot');
            }
            break;
        } else if (ship.direction && x === shipX && y >= shipY && y < shipY + ship.length) {
            ship.hit += 1;
            status = ship.hit === ship.length ? 'killed' : 'shot';
            updateAttack({ x, y }, me?.id as string, 'bot', 'shot');

            if (status === 'killed') {
                for (const cell of occupiedCells) {
                    updateAttack(cell, me?.id as string, 'bot', 'killed');
                }
                determineNearCells(occupiedCells, me?.id as string, 'bot');
            }
            break;
        }
    }

    if (status === 'miss') {
        updateAttack({ x, y }, me?.id as string, 'bot' as string, status);
        botStore.setCurrTurn('bot');
    } else {
        botStore.setCurrTurn(me?.id);
    }

    if(botStore.getCurrTurn() !== me?.id) {
        setTimeout(() => {
            botAttackMsg(server, 'bot' as string);
        }, 1000);

    }

    turn(botStore.getCurrTurn(), server);
    checkForWinner(botShips, me?.id as string, [me?.id as string, 'bot']);
}

export const sendBotShips = (server: WebSocket, playerId: string) => {
    const ships = playerId === 'bot' ? botStore.getShips() : botStore.getPlayerShips();
    const shipsOut = {
        type: CONSTANTS.START_GAME,
        data: JSON.stringify({ ships, currentPlayerIndex: playerId }),
        id: 0
    };
    server.send(JSON.stringify(shipsOut));
}

function turn(turnId: string, server: WebSocket) {
    let actualTurn: string = 'bot';
    if(turnId !== 'bot') actualTurn = turnId;
    const turnOut = {
        type: CONSTANTS.TURN,
        data: JSON.stringify({ currentPlayer: actualTurn }),
        id: 0
    };
    server.send(JSON.stringify(turnOut));
}

function botUpdateAttack(position: Position, enemyId: string, status: Status, server: WebSocket) {
    const attackOut = {
        type: CONSTANTS.ATTACK,
        data: JSON.stringify({
            position,
            currentPlayer: enemyId,
            status,
        }),
        id: 0,
    };

    server.send(JSON.stringify(attackOut));
};

function botDetermineNearCells(cells: Position[], enemyId: string, server: WebSocket) {
    const nearCells = new Set<{ x: number; y: number }>();
    
    const corners = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

    for (const cell of cells) {
        for (const [dx, dy] of corners) {
            nearCells.add({ x: cell.x + dx, y: cell.y + dy });
        }
    }

    Array.from(nearCells).forEach((pos) => {
        if (!cells.some((cell) => cell.x === pos.x && cell.y === pos.y)) {
            botUpdateAttack((pos),  enemyId, "miss", server);
        }
    });
};


export function botAttackMsg(server: WebSocket, playerId: string): void {
    const me = getMe(server);
    const playerShips = gameOpt.getShips(me?.id as string)!;
    let status: Status = "miss";
    
    const { x, y } = generateRanadomShot();
    
    for(let ship of playerShips!) {
        const occupiedCells = getCells(ship.position, ship.length, ship.direction);
        const shipX = ship.position.x;
        const shipY = ship.position.y;

        ship.hit = ship.hit || 0;

        if ((!ship.direction && y === shipY && x >= shipX && x < shipX + ship.length) ||
            (ship.direction && x === shipX && y >= shipY && y < shipY + ship.length)) {
            ship.hit += 1;
            status = ship.hit === ship.length ? 'killed' : 'shot';
            botUpdateAttack({ x, y }, playerId, status, server);
            if (status === 'killed') {
                for (const cell of occupiedCells) {
                    botUpdateAttack(cell, playerId, 'killed', server);
                }
                botDetermineNearCells(occupiedCells, playerId, server);
            }
            // botStore.setCurrTurn('bot');
            setTimeout(() => botAttackMsg(server, playerId), 900);
            return; 
        }
    }
    if (status === 'miss') {
        botUpdateAttack({ x, y }, playerId, status, server);
        botStore.setCurrTurn(me?.id as string);
    }

    botStore.setCurrTurn(status === 'miss' ? me?.id as string : 'bot');
    turn(botStore.getCurrTurn(), server);
}
