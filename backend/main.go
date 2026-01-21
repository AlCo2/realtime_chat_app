package main

import (
	"log"
	"main/route"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	route.CreateRoutes(router)

	if err := router.Run(); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
