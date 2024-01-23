type InputState = {
    keysPressed: { [key: string]: boolean }
};

export const updateInputState = (prevState: InputState, event: KeyboardEvent) => {
    const newState = {...prevState};

    if (event.type === 'keydown') {
        newState.keysPressed[event.key] = true;
    } else if (event.type === 'keyup') {
        newState.keysPressed[event.key] = false;
    }

    return newState;
} 

export const isKeyPressed = (inputState: InputState, key: string) => {
    return inputState.keysPressed[key] === true;
}

export let inputState: InputState = { keysPressed: {} };

window.addEventListener('keydown', (event) => {
    inputState = updateInputState(inputState, event);
});

window.addEventListener('keyup', (event) => {
    inputState = updateInputState(inputState, event);
});


export default InputState;