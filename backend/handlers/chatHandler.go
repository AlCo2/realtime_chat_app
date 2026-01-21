package handlers

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

type GetChatRequest struct {
	ChatId string `json:"chat_id" binding:"required"`
}

func GetChat(c *gin.Context) {
	var request GetChatRequest

	if err := c.ShouldBindUri(&request); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// to do later...
}

func CreateChat(c *gin.Context) {
	chat_id, _ := gonanoid.New(12)
	folder := "storage/chats"

	if err := os.MkdirAll(folder, os.ModePerm); err != nil {
		c.JSON(400, "Failed to create chat room")
		return
	}

	filePath := filepath.Join(folder, fmt.Sprintf("%s.json", chat_id))

	chat_file, err := os.Create(filePath)

	if err != nil {
		c.JSON(400, "Failed to create chat room")
		return
	}

	defer chat_file.Close()

	c.JSON(200, gin.H{
		"chat_id": chat_id,
	})
}
