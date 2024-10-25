import { WebSocket } from "ws";

export default class SocketStore {
    private static instance: SocketStore;
    private sockets: Map<string, WebSocket>;

    private constructor() {
        this.sockets = new Map();
    }

    public static getInstance(): SocketStore {
        if (!SocketStore.instance) {
            SocketStore.instance = new SocketStore();
        }
        return SocketStore.instance;
    }

    public getSocket(player: string): WebSocket | undefined {
        return this.sockets.get(player);
    }

    public setSocket(player: string, socket: WebSocket): void {
        this.sockets.set(player, socket);
    }

    public deleteSocket(player: string): void {
        this.sockets.delete(player);
    }

    public getAllSockets(): Map<string, WebSocket> {
        return this.sockets;
    }

    public sendToSockets(cb: (socket: WebSocket) => void): void {
        for(const sckt of this.sockets) {
            cb(sckt[1]);
        }
    }
}
