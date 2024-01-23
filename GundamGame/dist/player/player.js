import { isKeyPressed } from "../input/input.js";
import { game } from "../main.js";
import { State } from "./playerState.js";
export const updatePlayerAction = (player, inputState) => {
    let newX = player.x;
    let newY = player.y;
    console.log(player.type);
    let state = player.state.lock ? Object.assign({}, player.state) : {
        state: player.state.state,
        animations: player.type === "blast_impulse" ?
            player.mirrored ? game.firstPlayerAnimationMapMirrored[player.state.state] : game.firstPlayerAnimationMap[player.state.state] :
            player.mirrored ? game.secondPlayerAnimationMap[player.state.state] : game.secondPlayerAnimationMapMirrored[player.state.state],
        frameDuration: 250,
        currentFrame: player.state.currentFrame,
        lastFrameChangeTime: player.state.lastFrameChangeTime,
        mustLock: false,
        lock: false
    };
    let width = player.width;
    console.log("hehe");
    if (isKeyPressed(inputState, 'a')) {
        game.socket.sendMessage("command: " + JSON.stringify({ playerID: player.id, command: "moveleft" }));
        console.log("Send backward message");
        // if (!player.state.lock) {
        //     newX = player.x < 50 ? player.x : player.x - player.xSpeed;
        //     width = 600;
        //     const newDuration = player.state.state === State.Backward ? player.state.currentFrame : 0;
        //     state = !player.state.lock ? {
        //         state: State.Backward,
        //         animations: firstPlayerAnimationMap[State.Backward],
        //         currentFrame: nefirst_playerwDuration,
        //         frameDuration: 250,
        //         lastFrameChangeTime: player.state.lastFrameChangeTime,
        //         mustLock: player.state.mustLock,
        //         lock: player.state.lock
        //     } : player.state;
        // }
    }
    else if (isKeyPressed(inputState, 'd')) {
        game.socket.sendMessage("command: " + JSON.stringify({ playerID: player.id, command: "moveright" }));
        console.log("Send walking message");
        // if (!player.state.lock) {
        //     newX = player.x > 1400 ? player.x : player.x + player.xSpeed;
        //     width = 600;
        //     const newDuration = player.state.state === State.Walking ? player.state.currentFrame : 0;
        //     state = !player.state.lock ? {
        //         state: State.Walking,
        //         animations: firstPlayerAnimationMap[State.Walking],
        //         currentFrame: newDuration,
        //         frameDuration: 250,
        //         lastFrameChangeTime: player.state.lastFrameChangeTime,
        //         mustLock: player.state.mustLock,
        //         lock: player.state.lock
        //     } : player.state;
        // }   
    }
    else if (isKeyPressed(inputState, 'j')) {
        game.socket.sendMessage("command: " + JSON.stringify({ playerID: player.id, command: "attack" }));
        // if (!player.state.lock) {
        //     const newDuration = player.state.state === State.FrontKick ? player.state.currentFrame : 0;
        //     width = 700;
        //     state = !player.state.lock ? {
        //         state: State.FrontKick,
        //         animations: firstPlayerAnimationMap[State.FrontKick],
        //         currentFrame: newDuration,
        //         frameDuration: 350,
        //         lastFrameChangeTime: player.state.lastFrameChangeTime,
        //         mustLock: player.state.mustLock,
        //         lock: true
        //     }: player.state;
        // }
    }
    else if (game.first_player.state.state !== State.Idle && !player.state.lock) {
        game.socket.sendMessage("command: " + JSON.stringify({ playerID: player.id, command: "idle" }));
        console.log("Send idle message");
    }
    width = state.state === State.Idle ? 400 : width;
    return Object.assign(Object.assign({}, player), { width: width, state: state, x: newX });
};
