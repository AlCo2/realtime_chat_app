package main

import (
	"fmt"
	"main/security"
)

func main() {

	const temp = "test"
	encrypted := security.Encrypt(temp)

	fmt.Println("encrypted: ", encrypted)

	decrypted := security.Decrypt(encrypted)

	fmt.Println("decrypted: ", decrypted)
	// router := gin.Default()

	// router.Use(cors.New(cors.Config{
	// 	AllowOrigins:     []string{"http://localhost:5173"},
	// 	AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
	// 	AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
	// 	ExposeHeaders:    []string{"Content-Length"},
	// 	AllowCredentials: true,
	// 	MaxAge:           12 * time.Hour,
	// }))

	// route.CreateRoutes(router)

	// if err := router.Run(); err != nil {
	// 	log.Fatalf("failed to run server: %v", err)
	// }
}
