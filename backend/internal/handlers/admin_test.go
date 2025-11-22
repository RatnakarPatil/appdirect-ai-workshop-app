package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"appdirect-ai-workshop/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestAdminHandler_Login(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Set a test password
	os.Setenv("ADMIN_PASSWORD", "testpassword")
	defer os.Unsetenv("ADMIN_PASSWORD")

	mockService, err := services.NewFirestoreService()
	if err != nil {
		t.Skipf("Skipping test: Firestore not available: %v", err)
	}
	handler := NewAdminHandler(mockService)

	tests := []struct {
		name           string
		requestBody    map[string]string
		expectedStatus int
	}{
		{
			name: "valid password",
			requestBody: map[string]string{
				"password": "testpassword",
			},
			expectedStatus: http.StatusOK,
		},
		{
			name: "invalid password",
			requestBody: map[string]string{
				"password": "wrongpassword",
			},
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name: "missing password",
			requestBody: map[string]string{},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			router := gin.New()
			router.POST("/api/admin/login", handler.Login)

			body, _ := json.Marshal(tt.requestBody)
			req, _ := http.NewRequest("POST", "/api/admin/login", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

