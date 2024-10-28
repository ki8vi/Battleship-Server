import { randomUUID } from "crypto";
import { GameOptions, Ships } from "../types/data";

export default class Game {
    private static instance: Game;
    private gameOptions: GameOptions;
    private mapShips: Map<string, Ships[]>
    private currTurn: string = '';
    private diedShips: number = 0;
    private shoots: Map<string, Set<string>>;
    private isBotModeEnabled: boolean;

    private constructor() {
        this.gameOptions = { gameId: randomUUID(), meId: '', enemyId: '' };
        this.mapShips = new Map();
        this.shoots = new Map();
        this.isBotModeEnabled = false;
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

    public getAllPlayerShips(): Map<string, Ships[]> {
        return this.mapShips;
    }

    public setTurn(playerId: string): void {
        this.currTurn = playerId;
    }

    public getTurn(): string {
        return this.currTurn;
    }

    public countDiedShips(): void {
        this.diedShips += 1;
    }

    public getDiedShips(): number {
        return this.diedShips;
    }

    public addShoot(playerId: string, x: number, y: number): void {
        if (!this.shoots.has(playerId)) {
            this.shoots.set(playerId, new Set());
        }
        this.shoots.get(playerId)!.add(`${x},${y}`);
    }
    
    public hasShoot(playerId: string, x: number, y: number): boolean {
        return this.shoots.get(playerId)?.has(`${x},${y}`) || false;
    }
    
    public getShoots(playerId: string): Set<string> | undefined {
        return this.shoots.get(playerId);
    }

    public resetGame(): void {
        this.shoots.clear();
        this.mapShips.clear;
        this.diedShips = 0;
        this.currTurn = '';
        this.gameOptions = { gameId: randomUUID(), meId: '', enemyId: '' };
        this.isBotModeEnabled = false;
    }

    public getBotModeState(): boolean {
        return this.isBotModeEnabled;
    }

    public switchToBotMode(): void {
        this.isBotModeEnabled = true;
    }

    public setGameId(gameId: string): void {
        this.gameOptions.gameId = gameId
    }
}