import generateRanadomShot from "../helpers/randomGenerator";
import Game from "../store/game";
import { Position } from "../types/data";

const gameOptions = Game.getInstance();

const getNewPos = (playerId: string): Position => {
    let randomCoordinates: Position;
    do {
        randomCoordinates = generateRanadomShot();
    } while (gameOptions.hasShoot(playerId, randomCoordinates.x, randomCoordinates.y));
    return randomCoordinates;
};

export default getNewPos;