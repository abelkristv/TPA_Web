import InputState, { isKeyPressed } from "../input/input";
import { game } from "../main";
import SocketMessage from "../socket/socketMessage";
import PlayerState, { State } from "./playerState";

type Player = {
    x: number,
    y: number,
    type: string,
    width: number,
    height: number,
    xSpeed: number,
    ySpeed: number,
    health: number,
    maxHealth: number,
    id: string,
    mirrored: boolean,
    position: string,
    state: PlayerState
}

export const updatePlayerAction = (player: Player, inputState: InputState): Player => {
    let newX = player.x;
    let newY = player.y;
    console.log(player.type);
    let state: PlayerState = player.state.lock ? {
        ...player.state
    }
    : {
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

    let width: number = player.width;
    console.log("hehe")
    

    if (isKeyPressed(inputState, 'a')) {
        game.socket.sendMessage("command: " + JSON.stringify({playerID: player.id, command: "moveleft"} as SocketMessage));
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
    } else if (isKeyPressed(inputState, 'd')) {
        game.socket.sendMessage("command: " + JSON.stringify({playerID: player.id, command: "moveright"} as SocketMessage));
        console.log("Send walking message")
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
    } else if (isKeyPressed(inputState, 'j')) {
        game.socket.sendMessage("command: " + JSON.stringify({playerID: player.id, command: "attack"} as SocketMessage));
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
    } else if (game.first_player.state.state  !== State.Idle && !player.state.lock) {
        game.socket.sendMessage("command: " + JSON.stringify({playerID: player.id, command: "idle"} as SocketMessage));
        console.log("Send idle message")
    }

    width = state.state === State.Idle ? 400 : width;
    

    return { ...player, width: width, state: state, x: newX }
}

export default Player;