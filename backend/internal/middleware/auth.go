package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Simple session-based auth using cookie
func AdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check for admin session cookie
		adminCookie, err := c.Cookie("admin_session")
		if err != nil || adminCookie != "authenticated" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// VerifyPassword compares password with hashed password from env
func VerifyPassword(password string) bool {
	hashedPassword := os.Getenv("ADMIN_PASSWORD_HASH")
	if hashedPassword == "" {
		// Fallback to plain password for development
		expectedPassword := os.Getenv("ADMIN_PASSWORD")
		return password == expectedPassword
	}

	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

