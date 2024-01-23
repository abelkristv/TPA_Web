package main

type PlayerConnection struct {
	Player *Player
	Sock   *SafeWebSocket
}

var playerConnections []PlayerConnection
