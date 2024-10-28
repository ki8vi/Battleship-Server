import { randomBotShips } from "../helpers/randomBotShips";
import { Ships } from "../types/data";

export default class Bot {
    private static instance: Bot;
    private botShips: Ships[];
    private playerShips: Ships[] = [];
    private currTurn: string;

    private constructor() {
        this.botShips = randomBotShips();
        this.currTurn = '1';
    }

    public static getInstance(): Bot {
        if (!Bot.instance) {
            Bot.instance = new Bot();
        }
        return Bot.instance;
    }

    public setShips(ships: Ships[]): void {
        this.botShips = ships;
    }

    public getShips(): Ships[] {
        return this.botShips;
    }

    public getCurrTurn(): string {
        return this.currTurn;
    }

    public setCurrTurn(turn: string): void {
        this.currTurn = turn;
    }

    public setPlayerShips(ships: Ships[]): void {
        this.playerShips = ships;
    }

    public getPlayerShips(): Ships[] {
        return this.playerShips;
    }
}