
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

export type RegData = {
    type: TypeofInput,
    data: string,
    id: number,
}

export type Player = {
    name: string,
    password: string
}