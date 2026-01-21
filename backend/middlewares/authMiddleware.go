package middlewares

import "github.com/gin-gonic/gin"

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := c.Cookie("id")

		if err != nil {
			c.AbortWithStatusJSON(801, gin.H{"message": "Unauthorized"})
			return
		}

		c.Next()
	}
}
