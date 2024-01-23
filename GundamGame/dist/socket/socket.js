import { playerTest, setPlayerTest } from "../main.js";
import { game } from "../main.js";
import { State } from "../player/playerState.js";
export const createWebSocket = (url, onMessage) => {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(url);
        socket.onopen = () => {
            console.log("Successfully connected to webserver");
            resolve({ socket, sendMessage, closeConnection });
        };
        socket.onclose = (event) => event.wasClean ?
            console.log("Closed connection to webserver cleanly") :
            console.log("Closed connectoin to webserver uncleanly");
        socket.onmessage = (event) => {
            try {
                const [label, json] = event.data.split(/:(.+)/);
                console.log(label.trim());
                if (label.trim() === "player_command") {
                    const data = JSON.parse(json);
                    const state = data.State === "backward" ? State.Backward :
                        data.State === "walking" ? State.Walking :
                            data.State === "front_kick" ? State.FrontKick :
                                data.State === "idle" ? State.Idle : State.Idle;
                    console.log(data);
                    const playerState = game.first_player.id === data.Id ? game.first_player.state : game.second_player.state;
                    const animation = game.first_player.id === data.Id ?
                        game.first_player.type === "blast_impulse" ?
                            game.first_player.mirrored ? game.firstPlayerAnimationMapMirrored[state] : game.firstPlayerAnimationMap[state] :
                            game.second_player.mirrored ? game.secondPlayerAnimationMapMirrored[state] : game.secondPlayerAnimationMap[state] :
                        game.first_player.type === "blast_impulse" ?
                            game.second_player.mirrored ? game.secondPlayerAnimationMapMirrored[state] : game.secondPlayerAnimationMap[state] :
                            game.first_player.mirrored ? game.firstPlayerAnimationMapMirrored[state] : game.firstPlayerAnimationMap[state];
                    if (game.first_player.id === data.Id) {
                        console.log("first_player_state: ", game.first_player.state.state);
                        console.log("new state: ", data.State);
                        if (game.first_player.state.state !== state) {
                            playerState.currentFrame = 0;
                        }
                    }
                    if (game.first_player.id !== data.Id) {
                        console.log("second_player_state: ", game.first_player.state.state);
                        console.log("new state: ", data.State);
                        if (game.second_player.state.state !== state) {
                            playerState.currentFrame = 0;
                        }
                    }
                    playerState.state = state;
                    playerState.lock = data.Lock;
                    playerState.animations = animation;
                    if (game.first_player.id === data.Id) {
                        game.first_player = Object.assign(Object.assign({}, game.first_player), { x: data.X, y: data.Y, width: data.Width, height: data.Height, xSpeed: data.XSpeed, ySpeed: data.YSpeed, health: data.Health, maxHealth: data.MaxHealth, id: data.Id, state: playerState });
                        console.log("Updated first player", game.first_player);
                    }
                    if (game.first_player.id !== data.Id) {
                        game.second_player = Object.assign(Object.assign({}, game.second_player), { x: data.X, y: data.Y, width: data.Width, height: data.Height, xSpeed: data.XSpeed, ySpeed: data.YSpeed, health: data.Health, maxHealth: data.MaxHealth, id: data.Id, state: playerState });
                        console.log("Updated second player", game.second_player);
                    }
                }
                else if (label.trim() === "get_player") {
                    if (json == " 1") {
                        setPlayerTest(1);
                    }
                    else if (json == " 2") {
                        setPlayerTest(2);
                    }
                    console.log("success change player: ", playerTest);
                }
                console.log(playerTest === 1);
                console.log(json);
            }
            catch (error) {
                console.error("Error parsing player data", error);
            }
        };
        const sendMessage = (message) => {
            socket.send(message);
        };
        const closeConnection = () => {
            socket.close();
        };
    });
};
