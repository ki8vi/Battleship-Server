
type TypeofInput = 'reg' | 'update_winners' | 'create_room' | 'add_user_to_room' | 'create_game' | 'update_room' | 'add_ships' | 'start_game' | 'attack' | 'randomAttack' | 'turn' | 'finish';

type DataIn = {
    name: string,
    password: string,
}

type DataOut = {
    name: string,
    index: number | string,
    error: boolean,
    errorText: string,
}

export type RegData = {
    type: TypeofInput,
    data: DataIn | DataOut,
    id: number,
}
