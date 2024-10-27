
type TypeofInput = 'reg' | 'update_winners' | 'create_room' | 'add_user_to_room' | 'create_game' | 'update_room' | 'add_ships' | 'start_game' | 'attack' | 'randomAttack' | 'turn' | 'finish';

export type DataIn = {
    name: string,
    password: string,
}

export type DataOut = {
    name: string,
    index: number | string,
    error: boolean,
    errorText: string,
}

export type BaseData = {
    type: TypeofInput,
    data: string,
    id: number,
}

export type Player = {
    name: string,
    password: string,
    id: string,
    wins?: number
}

export type Win = {
    name: string,
    wins: number
} 

export type WinnerData = Win[];

export type RoomPlayer = {
    name: string;
    index: number | string | null;
};

export type GameRoom = {
    roomId: string;
    roomUsers: RoomPlayer[];
};

export type GameOptions = { gameId: string, meId: string, enemyId: string };

export type Position = { x: number; y: number };

export type Ships = {
    position: Position,
    direction: boolean,
    length: number,
    type: 'small' | 'medium' | 'large' | 'huge',
    hit: number
}

export type Status = 'miss' | 'killed' | 'shot';