package handlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/goombaio/namegenerator"
)

func Authenticate(c *gin.Context) {

	_, err := c.Cookie("id")

	if err != nil {
		id := uuid.New().String()
		c.SetCookie("id", id, 3600, "/", "", false, false)
	}

	username, err := c.Cookie("username")
	if err != nil {
		seed := time.Now().UTC().UnixNano()
		nameGenerator := namegenerator.NewNameGenerator(seed)

		name := nameGenerator.Generate()

		c.SetCookie("username", name, 3600, "/", "", false, false)

		username = name
	}

	c.JSON(200, gin.H{
		"username": username,
	})
}
