package handlers

import "github.com/gin-gonic/gin"

func Welcome(c *gin.Context) {

	c.JSON(200, "welcome from go backend server.")
}
