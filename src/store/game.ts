import { randomUUID } from "crypto";
import { GameOptions, Ships } from "../types/data";

export default class Game {
    private static instance: Game;
    private gameOptions: GameOptions;
    private mapShips: Map<string, Ships[]>

    private constructor() {
        this.gameOptions = { gameId: randomUUID(), meId: '', enemyId: '' };
        this.mapShips = new Map();
    }

    public static getInstance(): Game {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    public setPlayersOptions(meId: string, enemyId: string): void {
        this.gameOptions.meId = meId;
        this.gameOptions.enemyId = enemyId;
    }

    public getPlayersOptions(): GameOptions {
        return this.gameOptions;
    }

    public setShips(playerId: string, ships: Ships[]): void {
        this.mapShips.set(playerId, ships)
    }

    public getShips(playerId: string): Ships[] | undefined {
        return this.mapShips.get(playerId);
    }
 }