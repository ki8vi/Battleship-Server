import { Position } from "../types/data";

const generateRanadomShot = (): Position => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return { x, y };
};

export default generateRanadomShot;