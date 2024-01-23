import { gameLoop, getPlayer, initializeGame } from "./game/game";
import { loadFirstPlayerAllAnimations, loadFirstPlayerAllAnimationsMirrored, loadSecondPlayerAllAnimations } from "./player/playerState";
import { createWebSocket } from "./socket/socket";
export let playerTest: number = 0
export const setPlayerTest = (newValue: number) => {
    playerTest = newValue;
};
export const socket = await createWebSocket("ws://localhost:8080/ws", (data) => console.log("Message from server: ", data));
await getPlayer(socket);
console.log(playerTest === 1)
export const game = await initializeGame('gameCanvas');
requestAnimationFrame((timestamp) => gameLoop(game, timestamp));
