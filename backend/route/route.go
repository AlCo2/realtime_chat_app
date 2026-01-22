package route

import (
	"main/handlers"
	"main/middlewares"

	"github.com/gin-gonic/gin"
)

func CreateRoutes(router *gin.Engine) {

	router.GET("/", handlers.Welcome)

	{
		chatRoute := router.Group("/chat")
		chatRoute.Use(middlewares.AuthMiddleware())
		chatRoute.GET("", handlers.GetChat)
		chatRoute.POST("", handlers.CreateChat)
	}

	router.POST("/session", handlers.Authenticate)

	router.GET("/ws", handlers.ConnectWs).Use(middlewares.AuthMiddleware())

}
