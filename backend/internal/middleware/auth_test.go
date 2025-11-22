package middleware

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestAdminAuth(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		cookieValue    string
		expectedStatus int
	}{
		{
			name:           "authenticated",
			cookieValue:    "authenticated",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "not authenticated",
			cookieValue:    "",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "wrong cookie value",
			cookieValue:    "wrong",
			expectedStatus: http.StatusUnauthorized,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			router := gin.New()
			router.Use(AdminAuth())
			router.GET("/test", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "success"})
			})

			req, _ := http.NewRequest("GET", "/test", nil)
			if tt.cookieValue != "" {
				req.AddCookie(&http.Cookie{
					Name:  "admin_session",
					Value: tt.cookieValue,
				})
			}
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestVerifyPassword(t *testing.T) {
	os.Setenv("ADMIN_PASSWORD", "testpassword")
	defer os.Unsetenv("ADMIN_PASSWORD")

	tests := []struct {
		name     string
		password string
		expected bool
	}{
		{
			name:     "correct password",
			password: "testpassword",
			expected: true,
		},
		{
			name:     "incorrect password",
			password: "wrongpassword",
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := VerifyPassword(tt.password)
			assert.Equal(t, tt.expected, result)
		})
	}
}

