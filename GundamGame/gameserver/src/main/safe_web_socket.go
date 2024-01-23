package main

import (
	"sync"

	"github.com/gorilla/websocket"
)

type SafeWebSocket struct {
	conn  *websocket.Conn
	mutex sync.Mutex
}

func (ws *SafeWebSocket) WriteMessage(message []byte) error {
	ws.mutex.Lock()
	defer ws.mutex.Unlock()
	return ws.conn.WriteMessage(websocket.TextMessage, message)
}
