package middlewares

import "github.com/gin-gonic/gin"

func AuthMiddleware() gin.HandlerFunc {

	// todo: add encryption into usage....

	return func(c *gin.Context) {
		_, err := c.Cookie("id")

		if err != nil {
			c.AbortWithStatusJSON(401, "You don't have permission to perform this action")
			return
		}

		c.Next()
	}
}
