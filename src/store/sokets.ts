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

    public getSocket(playerID: string): WebSocket | undefined {
        return this.sockets.get(playerID);
    }

    public setSocket(playerID: string, socket: WebSocket): void {
        this.sockets.set(playerID, socket);
    }

    public deleteSocket(playerID: string): void {
        this.sockets.delete(playerID);
    }

    public getAllSockets(): Map<string, WebSocket> {
        return this.sockets;
    }

    public sendToSockets(cb: (socket: WebSocket) => void): void {
        for(const sckt of this.sockets) {
            if(sckt[1].readyState === WebSocket.OPEN) {
                cb(sckt[1]);
            }
        }
    }

    public getIdBySocket(socket: WebSocket): string | undefined {
        for (const [id, sckt] of this.sockets.entries()) {
            if (sckt === socket) {
                return id;
            }
        }
        return undefined;
    }
}
