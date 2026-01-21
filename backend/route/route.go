package route

import (
	"main/handlers"

	"github.com/gin-gonic/gin"
)

func CreateRoutes(router *gin.Engine) {

	router.GET("/", handlers.Welcome)

	router.POST("/session", handlers.Authenticate)

	router.GET("/ws", handlers.ConnectWs)

}
