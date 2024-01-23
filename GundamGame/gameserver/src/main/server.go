package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var players []Player
var playerCounter int = 0

func handleConnection(w http.ResponseWriter, r *http.Request) {

	sock, err := upgrader.Upgrade(w, r, nil)
	safeWebSocket := SafeWebSocket{
		conn: sock,
	}
	if err != nil {
		log.Println(err)
		return
	}
	defer sock.Close()

	for {
		if playerCounter > 0 {
			log.Printf(players[len(players)-1].State)
		}
		_, message, err := sock.ReadMessage()
		if err != nil {
			log.Printf("Error reading json: %v", err)
			break
		}
		fmt.Printf("Received message: %s\n", message)

		const playerPrefix = "player :"
		if strings.HasPrefix(string(message), playerPrefix) && playerCounter < 2 {
			jsonMessage := message[len(playerPrefix):]
			var playerData PlayerJSON
			if err := json.Unmarshal(jsonMessage, &playerData); err != nil {
				log.Printf("Error unmarshalling json: %v", err)
				continue
			}

			player := Player{
				X:         playerData.X,
				Y:         playerData.Y,
				Width:     playerData.Width,
				Height:    playerData.Height,
				XSpeed:    playerData.XSpeed,
				YSpeed:    playerData.YSpeed,
				Health:    playerData.Health,
				MaxHealth: playerData.MaxHealth,
				State:     playerData.State.State,
				Id:        playerData.Id,
			}
			players = append(players, player)
			playerConn := PlayerConnection{
				Player: &player,
				Sock:   &safeWebSocket,
			}
			playerConnections = append(playerConnections, playerConn)
			playerCounter++
		}

		const getPlayerPrefix = "request_player"
		if string(message) == getPlayerPrefix {
			if len(playerConnections) > 0 {
				sock.WriteMessage(websocket.TextMessage, []byte("get_player: 2"))
			} else {
				sock.WriteMessage(websocket.TextMessage, []byte("get_player: 1"))
			}
			log.Printf("Successfully writing player")
		}

		const commandPrefix = "command: "
		if strings.HasPrefix(string(message), commandPrefix) {
			jsonMessage := message[len(commandPrefix):]
			var commandData CommandJSON
			if err := json.Unmarshal(jsonMessage, &commandData); err != nil {
				log.Printf("Error unmarshalling json: %v", err)
				continue
			}

			var curPlayer Player
			var playerIndex int = 1000
			for num, player := range players {
				if player.Id == commandData.PlayerID {
					playerIndex = num
					curPlayer = player
				}
			}
			if playerIndex == 1000 {
				log.Fatal("Player unidentified")
			}

			if commandData.Command == "moveleft" {
				curPlayer.SetX(curPlayer.X - curPlayer.XSpeed)
				curPlayer.SetState("backward")
				curPlayer.SetWidth(600)
				curPlayer.SetLock(curPlayer.Lock)
				curPlayer.SetMustLock(curPlayer.Mustlock)
				curPlayer.SetLastFrameChangeTime(curPlayer.LastFrameChangeTime)
			} else if commandData.Command == "moveright" {
				curPlayer.SetX(curPlayer.X + curPlayer.XSpeed)
				curPlayer.SetState("walking")
				curPlayer.SetWidth(600)
				curPlayer.SetLock(curPlayer.Lock)
				curPlayer.SetMustLock(curPlayer.Mustlock)
				curPlayer.SetLastFrameChangeTime(curPlayer.LastFrameChangeTime)
			} else if commandData.Command == "idle" {
				curPlayer.SetWidth(400)
				curPlayer.SetState("idle")
				curPlayer.SetLock(false)
				curPlayer.SetMustLock(false)
			} else if commandData.Command == "attack" {
				curPlayer.SetWidth(600)
				curPlayer.SetState("front_kick")
				curPlayer.SetLock(true)
				curPlayer.SetMustLock(false)
			}

			playerData, err := json.Marshal(curPlayer)
			if err != nil {
				log.Printf("Error marshalling player data: %v", err)
				return
			}

			for _, pc := range playerConnections {
				err := pc.Sock.WriteMessage([]byte("player_command : " + string(playerData)))
				if err != nil {
					log.Printf("Error broadcasting to player %s: %v", pc.Player.Id, err)
					// You might want to handle disconnection here
				}
			}

			players[playerIndex] = curPlayer
		}
	}
}

func main() {
	http.HandleFunc("/ws", handleConnection)

	log.Println("Web Socket started at port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Listen and Server: ", err)
	}
}
