type Position = { x: number; y: number };

const getCells = (pos: Position, length: number, direction: boolean): Position[] => {
        const cells: { x: number; y: number }[] = [];
        for (let i = 0; i < length; i += 1) {
            const x = direction ? pos.x : pos.x + i;
            const y = direction ? pos.y + i : pos.y;
            
            if (x >= 0 && x < 10 && y >= 0 && y < 10) {
                cells.push({ x, y });
            }
        }
        return cells;
};

export default getCells;