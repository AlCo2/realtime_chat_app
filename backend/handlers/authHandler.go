package handlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/goombaio/namegenerator"
)

func Authenticate(c *gin.Context) {
	username, err := c.Cookie("username")
	if err != nil {
		seed := time.Now().UTC().UnixNano()
		nameGenerator := namegenerator.NewNameGenerator(seed)

		name := nameGenerator.Generate()

		c.SetCookie("username", name, 3600, "/", "", false, false)

		c.JSON(200, gin.H{
			"username": name,
		})
		return
	}

	c.JSON(200, gin.H{
		"username": username,
	})
}
