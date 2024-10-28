import { RawData, WebSocket } from "ws";
import CONSTANTS from "../constants";
import Game from "../store/game";
import { deserialize } from "../helpers/deserialize";
import { randomBotShips } from "../helpers/randomBotShips";
import { botAttack, sendBotShips } from "../helpers/botCore";
import Bot from "../store/botStore";
import Players from "../store/players";
import SocketStore from "../store/sokets";
import getMe from "../helpers/getMe";
import RoomsStore from "../store/rooms";
import { GameRoom, Player, RoomPlayer } from "../types/data";

const gameOptions = Game.getInstance();
const botStore = Bot.getInstance();
const players = Players.getInstance();
const sockets = SocketStore.getInstance();
const rooms = RoomsStore.getInstance();


const singlePlay = (server: WebSocket) => {
    gameOptions.switchToBotMode();
    const me = getMe(server);
    botStore.setCurrTurn(me?.id as string);
    const botServer = new WebSocket('ws://localhost:3000');
    
    server.send(JSON.stringify({ type: CONSTANTS.CREATE_GAME, data: JSON.stringify({ idGame: 'bot', idPlayer: me?.id }), id: 0 }));
    createBotPlayer(botServer, { name: me?.name as string, index: me?.id as string })

    server.on('message', (dataInput: RawData) => {
        const parsedReq = deserialize(dataInput);
        botServer.send(dataInput)
        const { type, data } = parsedReq;
        console.log(`BOT MODE: ${type}`);
        switch(type) {
            case CONSTANTS.ADD_SHIPS:
                gameOptions.setShips(me?.id as string, JSON.parse(data).ships);
                sendBotShips(server, me?.id as string);
                break;
            case CONSTANTS.ATTACK:
                botAttack(data, server);
                break;
        }
    });
};

export default singlePlay;

function createBotPlayer(botServer: WebSocket, humanPlayer: RoomPlayer) {
    gameOptions.setTurn(humanPlayer.index as string);
    gameOptions.setPlayersOptions(humanPlayer.index as string, 'bot');
    gameOptions.setGameId('bot');
    const bot: Player = {
        name: 'bot',
        password: 'bot',
        id: 'bot',
        wins: 0,
    };
    players.addPlayer(bot);
    sockets.setSocket(bot.id, botServer);
    const roomBot: RoomPlayer = { name: bot.name, index: bot.id }
    const newRoom: GameRoom = { roomId: 'bot', roomUsers: [roomBot, humanPlayer] };
    rooms.addNewRoom(newRoom);
    gameOptions.setShips('bot', randomBotShips());
}

