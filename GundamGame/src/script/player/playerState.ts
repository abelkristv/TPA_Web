import { playerTest } from "../main";
import Player from "./player";

export enum State {
    Idle = "idle",
    Backward = "backward",
    FrontKick = "front_kick",
    Jump = "jump",
    LowKick = "low_kick",
    Walking = "walking"
}

type PlayerState = {
    state: State,
    animations: HTMLImageElement[],
    frameDuration: number,
    currentFrame: number,
    lastFrameChangeTime: number,
    mustLock: boolean,
    lock: boolean
}

export type AnimationMap = { [key in State]: HTMLImageElement[] }

const loadAnimationState = (state: State) => (frameLimit: (state: State) => number) => (character: string) => (mode: string = '') : Promise<HTMLImageElement[]> => {
    const limit = frameLimit(state);
    const frameNumbers = Array.from({ length: limit }, (_, i) => i + 1);
    return Promise.all(frameNumbers.map(frameNumber => loadAnimationPerFrame(frameNumber)(state)(character)(mode)));
};

const loadAnimationPerFrame = (frameNumber: number) => (state: State) => (character: string) => (mode: string) : Promise<HTMLImageElement> => {
    const image = new Image();
    image.src = `../../../asset/${character}/${state}${mode}/${state}_${frameNumber}${mode}.png`;
    return new Promise((resolve, reject) => {
        image.onload = () => resolve(image)
        image.onerror = reject;
    })
}

export async function loadFirstPlayerAllAnimations(): Promise<AnimationMap> {
    const animationMap: Partial<AnimationMap> = {};

    for (const state of Object.values(State)) {
        animationMap[state] = await loadAnimationState(state)(state => 
            state === State.Idle ? 6 : 
            state === State.FrontKick || state === State.Walking || state === State.Backward ? 3 : 
            state === State.LowKick ? 4 : 
            state === State.Jump ? 1 : 0)("blast_impulse")('');
    }
    return animationMap as AnimationMap;
}

export async function loadFirstPlayerAllAnimationsMirrored(): Promise<AnimationMap> {
    const animationMap: Partial<AnimationMap> = {};

    for (const state of Object.values(State)) {
        animationMap[state] = await loadAnimationState(state)(state => 
            state === State.Idle ? 6 : 
            state === State.FrontKick || state === State.Walking || state === State.Backward ? 3 : 
            state === State.LowKick ? 4 : 
            state === State.Jump ? 1 : 0)("blast_impulse")('_mirrored');
    }
    return animationMap as AnimationMap;
}

export async function loadSecondPlayerAllAnimations(): Promise<AnimationMap> {
    const animationMap: Partial<AnimationMap> = {};

    for (const state of Object.values(State)) {
        animationMap[state] = await loadAnimationState(state)(state => 
            state === (State.Idle || State.Jump) ? 6 : 
            state === State.Walking || state === State.Backward ? 10 :
            state === State.FrontKick ? 4 : 
            state === State.LowKick ? 3 : 0)("sword_impulse")('');
    }

    return animationMap as AnimationMap;
}

export async function loadSecondPlayerAllAnimationsMirorred(): Promise<AnimationMap> {
    const animationMap: Partial<AnimationMap> = {};

    for (const state of Object.values(State)) {
        animationMap[state] = await loadAnimationState(state)(state => 
            state === (State.Idle || State.Jump) ? 6 : 
            state === State.Walking || state === State.Backward ? 10 :
            state === State.FrontKick ? 4 : 
            state === State.LowKick ? 3 : 0)("sword_impulse")('_mirrored');
    }

    return animationMap as AnimationMap;
}

function setPlayerState(state: State, animationMap: AnimationMap, frameDuration: number): PlayerState {
    return {
        state: state,
        animations: animationMap[state],
        frameDuration: frameDuration,
        currentFrame: 0,
        lastFrameChangeTime: performance.now(),
        mustLock: false,
        lock: false
    };
}

export function drawPlayer(player: Player, ctx: CanvasRenderingContext2D) {
    
    const frame = player.state.animations[player.state.currentFrame];
    ctx.drawImage(frame, player.x, player.y, player.width, player.height);
}

export const updateAnimation = (playerState: PlayerState): PlayerState => {
    const currentTime = performance.now();
    let newState: PlayerState = playerState;
    if (currentTime - playerState.lastFrameChangeTime > playerState.frameDuration) {
        newState.currentFrame = (playerState.currentFrame + 1) % playerState.animations.length;
        newState.lastFrameChangeTime = currentTime;
        if (playerState.mustLock === true) {
            newState.mustLock = false;
            newState.lock = false;
        }
        if (newState.currentFrame === newState.animations.length - 1) {
            newState.mustLock = true;
        }
    }
    return {...playerState, currentFrame: newState.currentFrame, lock: newState.lock, mustLock: newState.mustLock, lastFrameChangeTime: newState.lastFrameChangeTime};
}


export default PlayerState;