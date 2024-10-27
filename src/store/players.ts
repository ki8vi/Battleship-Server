import { Player, WinnerData } from "../types/data";


export default class Players {
    static instanceSingletone: Players;
    private players: Player[];
    private myId: string | null = null;

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

    public checkById(id: string): boolean {
        return this.players.some((pl) => pl.id === id);
    }

    public addPlayer(player: Player): void {
        this.players.push(player);
    }


    public getPlayerId(player: Player): string | undefined {
        const foundPlayer = this.players.find((pl) => pl.name === player.name);
        return foundPlayer ? foundPlayer.id : undefined;
    }

    public checkPassword(player: Player): boolean {
        return this.players.some((pl) => pl.password === player.password);
    }

    public takeWinners(): WinnerData {
        const winners = this.players.reduce<WinnerData>((acc, pl) => {
            acc.push({ name: pl.name, wins: pl.wins! });
            return acc;
        }, []);
        
        winners.sort((a, b) => b.wins - a.wins);
        
        return winners;
    }

    public getMyId(): string | null {
        return this.myId;
    }

    public setMyId(id: string): void {
        this.myId = id;
    }

    public deletePlayer(playerId: string): void {
        this.players = this.players.filter((pl) => pl.id !== playerId);
    }

    public addWin(playerId: string): boolean {
        const winner = this.players.find((pl) => pl.id === playerId);
        if(winner) {
            winner.wins! += 1;
            return true;
        }
        return false;
    }
}