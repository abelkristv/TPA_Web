export const updateInputState = (prevState, event) => {
    const newState = Object.assign({}, prevState);
    if (event.type === 'keydown') {
        newState.keysPressed[event.key] = true;
    }
    else if (event.type === 'keyup') {
        newState.keysPressed[event.key] = false;
    }
    return newState;
};
export const isKeyPressed = (inputState, key) => {
    return inputState.keysPressed[key] === true;
};
export let inputState = { keysPressed: {} };
window.addEventListener('keydown', (event) => {
    inputState = updateInputState(inputState, event);
});
window.addEventListener('keyup', (event) => {
    inputState = updateInputState(inputState, event);
});
