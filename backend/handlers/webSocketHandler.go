package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"main/models"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Client struct {
	ID       string
	Conn     *websocket.Conn
	Send     chan []byte
	Room     *Room
	username string
}

type Room struct {
	ID      string
	clients map[*Client]bool
	mu      sync.RWMutex
}

type IncomingMessage struct {
	Content string `json:"content"`
	ChatID  string `json:"chat_id"`
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
		var incoming IncomingMessage
		if err := json.Unmarshal(msg, &incoming); err != nil {
			log.Println("Invalid JSON:", err)
			continue
		}
		t := time.Now()
		chat := models.Message{
			Id:             13,
			Text:           incoming.Content,
			SenderId:       c.ID,
			SenderUsername: c.username,
			Timestamp:      &t,
		}
		data, err := json.Marshal(chat)
		if err != nil {
			log.Println("Error marshaling message:", err)
			return
		}

		c.Room.Broadcast(data)
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
	chat_id := c.Query("chat_id")
	user_id, _ := c.Cookie("id")
	username, _ := c.Cookie("username")

	if chat_id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "chat ID required"})
		return
	}

	folder := "storage/chats"

	filePath := filepath.Join(folder, fmt.Sprintf("%s.json", chat_id))

	_, err := os.Stat(filePath)

	if err != nil {
		c.JSON(404, "This chat room doesn't exist.")
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

	room := getRoom(chat_id)

	client := &Client{
		ID:       user_id,
		username: username,
		Conn:     conn,
		Send:     make(chan []byte, 256),
		Room:     room,
	}

	room.Join(client)

	go client.WritePump()
	go client.ReadPump()
}
