import { Player } from "../types/data";


export default class Players {
    static instanceSingletone: Players;
    private players: Player[];

    constructor() {
        this.players = []; 
    }

    static getInstance(): Players {
        if (!Players.instanceSingletone) {
            Players.instanceSingletone = new Players();
        }
        return Players.instanceSingletone;
    }

    public getPlayers() {
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
}