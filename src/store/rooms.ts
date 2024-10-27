import { GameRoom, Player, RoomPlayer } from "../types/data";

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

    public addPlayerToRoom(roomId: string, player: RoomPlayer): boolean {
        const room = this.rooms.find((room) => room.roomId === roomId);
        if (room && room.roomUsers.length < 2) {
            const isPlayerInRoom = room.roomUsers.some((user) => user.name === player.name);
            if (!isPlayerInRoom) {
                room.roomUsers.push(player);
                return true;
            }
        }
        return false;
    }

    public getRoomsWithOnePlayer(): GameRoom[] {
        return this.rooms.filter((room) => room.roomUsers.length === 1);
    }

    public getRoomById(roomId: string): GameRoom | undefined {
        return this.rooms.find((room) => room.roomId === roomId);
    }

    public deleteRoomsWithPlayers(playerIds: string[]): void {
        this.rooms = this.rooms.filter(room => {
            const isInRoom = room.roomUsers.some(user => playerIds.includes(user.index as string));
            if (isInRoom) {
                this.deleteRoom(room.roomId);
                return false;
            }
            return true;
        });
    }
  
}

