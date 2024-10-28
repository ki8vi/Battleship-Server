import { Position } from '../types/data';
import updateAttack from './udateAttack';

const determineNearCells = (cells: Position[], meId: string, enemyId: string) => {
    const nearCells = new Set<{ x: number; y: number }>();
    
    const corners = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

    for (const cell of cells) {
        for (const [dx, dy] of corners) {
            nearCells.add({ x: cell.x + dx, y: cell.y + dy });
        }
    }

    Array.from(nearCells).forEach((pos) => {
        if (!cells.some((cell) => cell.x === pos.x && cell.y === pos.y)) {
            updateAttack((pos), meId, enemyId, "miss");
        }
    });
};

export default determineNearCells;
