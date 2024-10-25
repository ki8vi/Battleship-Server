import { GameRoom } from "../types/data";

export default class RoomsStore {

    private static instance: RoomsStore;
    private rooms: GameRoom[];

    private constructor() {
        this.rooms = new Array();
    }

    public static getInstance(): RoomsStore {
        if (!RoomsStore.instance) {
            RoomsStore.instance = new RoomsStore();
        }
        return RoomsStore.instance;
    }

    public getAllRooms():GameRoom[]  {
        return this.rooms;
    }

    public addNewRoom(newRoom: GameRoom): void {
        this.rooms.push(newRoom);
    }

    public deleteRoom(roomId: string): boolean {
        const targetRoomIndex = this.rooms.findIndex((room) => room.roomId === roomId);
        if(targetRoomIndex !== -1) {
            this.rooms.splice(targetRoomIndex, 1);
            return true;
        }
        return false;
    }

  
}

