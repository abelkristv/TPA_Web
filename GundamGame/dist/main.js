import { gameLoop, getPlayer, initializeGame } from "./game/game.js";
import { createWebSocket } from "./socket/socket.js";
export let playerTest = 0;
export const setPlayerTest = (newValue) => {
    playerTest = newValue;
};
export const socket = await createWebSocket("ws://localhost:8080/ws", (data) => console.log("Message from server: ", data));
await getPlayer(socket);
console.log(playerTest === 1);
export const game = await initializeGame('gameCanvas');
requestAnimationFrame((timestamp) => gameLoop(game, timestamp));
