import { inputState } from "../input/input.js";
import { playerTest, socket } from "../main.js";
import { updatePlayerAction } from "../player/player.js";
import { State, drawPlayer, loadFirstPlayerAllAnimations, loadFirstPlayerAllAnimationsMirrored, loadSecondPlayerAllAnimations, loadSecondPlayerAllAnimationsMirorred, updateAnimation } from "../player/playerState.js";
var GameState;
(function (GameState) {
    GameState[GameState["Initializing"] = 0] = "Initializing";
    GameState[GameState["Running"] = 1] = "Running";
    GameState[GameState["Paused"] = 2] = "Paused";
    GameState[GameState["Ended"] = 3] = "Ended";
})(GameState || (GameState = {}));
const generateRandomID = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
export const getPlayer = (socket) => {
    return new Promise((resolve, reject) => {
        socket.sendMessage("request_player");
        // Create a function to handle the playerTest update
        const checkPlayerTest = () => {
            if (playerTest !== 0) {
                resolve();
            }
            else {
                // Check again after a short delay
                setTimeout(checkPlayerTest, 100); // Check every 100 milliseconds
            }
        };
        // Start the check
        checkPlayerTest();
    });
};
export const initializeGame = async (canvasID) => {
    const canvas = document.getElementById(canvasID);
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    const backgroundImage = new Image();
    backgroundImage.src = '../../asset/background/background.png';
    const healthBar_image = new Image();
    healthBar_image.src = '../../asset/lifebar_full.png';
    const id = generateRandomID(10);
    const firstPlayerAnimationMap = await loadFirstPlayerAllAnimations();
    const firstPlayerAnimationMapMirrored = await loadFirstPlayerAllAnimationsMirrored();
    const secondPlayerAnimationMap = await loadSecondPlayerAllAnimations();
    const secondPlayerAnimationMapMirrored = await loadSecondPlayerAllAnimationsMirorred();
    const first_player = {
        x: 200,
        y: 400,
        width: 400,
        height: 500,
        xSpeed: 3,
        ySpeed: 3,
        health: 100,
        type: "blast_impulse",
        maxHealth: 100,
        id: id,
        position: "normal",
        mirrored: false,
        state: {
            state: State.Idle,
            animations: firstPlayerAnimationMap[State.Idle],
            currentFrame: 0,
            frameDuration: 250,
            mustLock: false,
            lock: false,
            lastFrameChangeTime: performance.now()
        }
    };
    const second_player = {
        x: 1400,
        y: 400,
        width: 400,
        height: 500,
        xSpeed: 3,
        ySpeed: 3,
        health: 100,
        maxHealth: 100,
        type: "sword_impulse",
        id: id,
        position: "reversed",
        mirrored: false,
        state: {
            state: State.Idle,
            animations: secondPlayerAnimationMap[State.Idle],
            currentFrame: 0,
            frameDuration: 250,
            mustLock: false,
            lock: false,
            lastFrameChangeTime: performance.now()
        }
    };
    let currentPlayer;
    let enemyPlayer;
    if (playerTest === 1) {
        currentPlayer = first_player;
        enemyPlayer = second_player;
    }
    else {
        currentPlayer = second_player;
        enemyPlayer = first_player;
    }
    console.log("current Player: ", currentPlayer);
    console.log("enemy: ", enemyPlayer);
    socket.sendMessage("player : " + JSON.stringify(currentPlayer));
    return {
        state: GameState.Initializing,
        first_player: currentPlayer,
        second_player: enemyPlayer,
        canvas: canvas,
        ctx: ctx,
        background_image: backgroundImage,
        healthBar_image: healthBar_image,
        firstPlayerAnimationMap: firstPlayerAnimationMap,
        firstPlayerAnimationMapMirrored: firstPlayerAnimationMapMirrored,
        secondPlayerAnimationMap: secondPlayerAnimationMap,
        secondPlayerAnimationMapMirrored: secondPlayerAnimationMapMirrored,
        socket: socket,
        id: id
    };
};
const drawFirstPlayerHealthBar = (game) => {
    game.ctx.fillStyle = '#FFFF00';
    game.ctx.fillRect(60, 100, game.first_player.health * 10, 50);
};
const drawSecondPlayerHealthBar = (game) => {
    game.ctx.fillStyle = '#FFF00';
    game.ctx.fillRect(700, 100, game.first_player.health * 10, 50);
};
const render = (game) => {
    game.ctx.drawImage(game.background_image, 0, 0, game.canvas.width, game.canvas.height);
    drawFirstPlayerHealthBar(game);
    drawSecondPlayerHealthBar(game);
    game.ctx.drawImage(game.healthBar_image, 20, 20, 1870, 200);
    drawPlayer(game.first_player, game.ctx);
    drawPlayer(game.second_player, game.ctx);
};
const update = (game) => {
    game.state = GameState.Running;
    console.log(game.first_player.x > game.second_player.x);
    if (game.first_player.x > game.second_player.x && playerTest == 1) {
        game.first_player.mirrored = true;
        game.second_player.mirrored = false;
    }
    else {
        game.first_player.mirrored = false;
        game.second_player.mirrored = true;
    }
    console.log("first_player ", game.first_player);
    console.log("second_player, ", game.second_player);
    game.first_player = updatePlayerAction(game.first_player, inputState);
    game.first_player.state = updateAnimation(game.first_player.state);
    game.second_player.state = updateAnimation(game.second_player.state);
    console.log(game.first_player.state.animations);
    console.log(game.first_player.state.currentFrame);
};
export const gameLoop = (game, timestamp) => {
    update(game);
    render(game);
    requestAnimationFrame(() => gameLoop(game, timestamp));
};
