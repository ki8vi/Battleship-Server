import { Player, WinnerData } from "../types/data";


export default class Players {
    static instanceSingletone: Players;
    private players: Player[];
    private myIndex: number | null = null;

    constructor() {
        this.players = []; 
    }

    static getInstance(): Players {
        if (!Players.instanceSingletone) {
            Players.instanceSingletone = new Players();
        }
        return Players.instanceSingletone;
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public checkPlayerByName(player: Player): boolean {
        return this.players.some((pl) => pl.name === player.name);
    }

    public addPlayer(player: Player): void {
        this.players.push(player);
        // if(!this.checkPlayer(player)) {
        //     return true;
        // }
        // return false;
    }

    public getPlayerIndex(player: Player): number {
        return this.players.findIndex((pl) => pl.name === player.name);
    }

    public checkPassword(player: Player): boolean {
        return this.players.some((pl) => pl.password === player.password);
    }

    public takeWinners(): WinnerData {
        return this.players.reduce<WinnerData>((acc, pl) => {
            acc.push({ name: pl.name, wins: pl.wins! });
            return acc;
        }, []);
    }

    public getMyIndex(): number | null {
        if(this.myIndex !== null) {
            return this.getPlayerIndex(this.players[this.myIndex]);
        }
        return null;
    }

    public setMyIndex(me: Player): void {
        this.myIndex = this.getPlayerIndex(me);
    }
}