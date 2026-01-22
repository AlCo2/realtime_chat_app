package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"main/models"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

type GetChatRequest struct {
	ChatId string `form:"chat_id" binding:"required"`
}

func analyseChatFile(filePath string) (*models.Chat, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, errors.New("couldn't open chat file")
	}

	defer file.Close()

	var chat models.Chat
	decoder := json.NewDecoder(file)

	if err := decoder.Decode(&chat); err != nil {
		fmt.Print(err)
		return nil, errors.New("failed to load chat")
	}

	return &chat, nil
}

func GetChat(c *gin.Context) {
	var request GetChatRequest

	if err := c.ShouldBindQuery(&request); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	folder := "storage/chats"

	filePath := filepath.Join(folder, fmt.Sprintf("%s.json", request.ChatId))

	_, err := os.Stat(filePath)

	if err != nil {
		c.JSON(404, "This chat room doesn't exist.")
		return
	}

	chat, err := analyseChatFile(filePath)
	if err != nil {
		c.JSON(400, "Failed to load chat messages")
		return
	}

	c.JSON(200, gin.H{
		"id":       chat.Id,
		"messages": chat.Messages,
	})
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

	chat := models.Chat{
		Id:       chat_id,
		Messages: make([]models.Message, 0),
	}

	encoder := json.NewEncoder(chat_file)

	encoder.SetIndent("", "  ")

	if err := encoder.Encode(chat); err != nil {
		c.JSON(500, "Failed to init chat")
		return
	}

	c.JSON(200, gin.H{
		"chat_id": chat_id,
	})
}
