export var State;
(function (State) {
    State["Idle"] = "idle";
    State["Backward"] = "backward";
    State["FrontKick"] = "front_kick";
    State["Jump"] = "jump";
    State["LowKick"] = "low_kick";
    State["Walking"] = "walking";
})(State || (State = {}));
const loadAnimationState = (state) => (frameLimit) => (character) => (mode = '') => {
    const limit = frameLimit(state);
    const frameNumbers = Array.from({ length: limit }, (_, i) => i + 1);
    return Promise.all(frameNumbers.map(frameNumber => loadAnimationPerFrame(frameNumber)(state)(character)(mode)));
};
const loadAnimationPerFrame = (frameNumber) => (state) => (character) => (mode) => {
    const image = new Image();
    image.src = `../../../asset/${character}/${state}${mode}/${state}_${frameNumber}${mode}.png`;
    return new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
};
export async function loadFirstPlayerAllAnimations() {
    const animationMap = {};
    for (const state of Object.values(State)) {
        animationMap[state] = await loadAnimationState(state)(state => state === State.Idle ? 6 :
            state === State.FrontKick || state === State.Walking || state === State.Backward ? 3 :
                state === State.LowKick ? 4 :
                    state === State.Jump ? 1 : 0)("blast_impulse")('');
    }
    return animationMap;
}
export async function loadFirstPlayerAllAnimationsMirrored() {
    const animationMap = {};
    for (const state of Object.values(State)) {
        animationMap[state] = await loadAnimationState(state)(state => state === State.Idle ? 6 :
            state === State.FrontKick || state === State.Walking || state === State.Backward ? 3 :
                state === State.LowKick ? 4 :
                    state === State.Jump ? 1 : 0)("blast_impulse")('_mirrored');
    }
    return animationMap;
}
export async function loadSecondPlayerAllAnimations() {
    const animationMap = {};
    for (const state of Object.values(State)) {
        animationMap[state] = await loadAnimationState(state)(state => state === (State.Idle || State.Jump) ? 6 :
            state === State.Walking || state === State.Backward ? 10 :
                state === State.FrontKick ? 4 :
                    state === State.LowKick ? 3 : 0)("sword_impulse")('');
    }
    return animationMap;
}
export async function loadSecondPlayerAllAnimationsMirorred() {
    const animationMap = {};
    for (const state of Object.values(State)) {
        animationMap[state] = await loadAnimationState(state)(state => state === (State.Idle || State.Jump) ? 6 :
            state === State.Walking || state === State.Backward ? 10 :
                state === State.FrontKick ? 4 :
                    state === State.LowKick ? 3 : 0)("sword_impulse")('_mirrored');
    }
    return animationMap;
}
function setPlayerState(state, animationMap, frameDuration) {
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
export function drawPlayer(player, ctx) {
    const frame = player.state.animations[player.state.currentFrame];
    ctx.drawImage(frame, player.x, player.y, player.width, player.height);
}
export const updateAnimation = (playerState) => {
    const currentTime = performance.now();
    let newState = playerState;
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
    return Object.assign(Object.assign({}, playerState), { currentFrame: newState.currentFrame, lock: newState.lock, mustLock: newState.mustLock, lastFrameChangeTime: newState.lastFrameChangeTime });
};
