package handlers

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Send chan []byte
	Room *Room
}

type Room struct {
	ID      string
	clients map[*Client]bool
	mu      sync.RWMutex
}

func NewRoom(id string) *Room {
	return &Room{
		ID:      id,
		clients: make(map[*Client]bool),
	}
}

func (r *Room) Join(c *Client) {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.clients[c] = true
}

func (r *Room) Leave(c *Client) {
	r.mu.Lock()
	defer r.mu.Unlock()

	delete(r.clients, c)
	close(c.Send)
}

func (room *Room) Broadcast(msg []byte) {
	room.mu.RLock()
	defer room.mu.RUnlock()

	for c := range room.clients {
		select {
		case c.Send <- msg:
		default:
		}
	}
}

var (
	rooms   = make(map[string]*Room)
	roomsMu sync.Mutex
)

func getRoom(id string) *Room {
	roomsMu.Lock()
	defer roomsMu.Unlock()

	if r, ok := rooms[id]; ok {
		return r
	}

	r := NewRoom(id)
	rooms[id] = r
	return r
}

func (c *Client) ReadPump() {
	defer func() {
		c.Room.Leave(c)
	}()

	for {
		_, msg, err := c.Conn.ReadMessage()
		if err != nil {
			return
		}
		c.Room.Broadcast(msg)
	}
}

func (c *Client) WritePump() {
	for msg := range c.Send {
		err := c.Conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			return
		}
	}
}

func ConnectWs(c *gin.Context) {
	roomID := c.Query("room")
	if roomID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "room required"})
		return
	}

	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return
	}

	room := getRoom(roomID)

	client := &Client{
		ID:   uuid.NewString(),
		Conn: conn,
		Send: make(chan []byte, 256),
		Room: room,
	}

	room.Join(client)

	go client.WritePump()
	go client.ReadPump()
}
