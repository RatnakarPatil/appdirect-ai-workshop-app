package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"appdirect-ai-workshop/internal/models"
	"appdirect-ai-workshop/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestSessionHandler_GetSessions(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService, err := services.NewFirestoreService()
	if err != nil {
		t.Skipf("Skipping test: Firestore not available: %v", err)
	}
	handler := NewSessionHandler(mockService)

	router := gin.New()
	router.GET("/api/sessions", handler.GetSessions)

	req, _ := http.NewRequest("GET", "/api/sessions", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var sessions []models.Session
	json.Unmarshal(w.Body.Bytes(), &sessions)
	assert.NotNil(t, sessions)
}

func TestSessionHandler_CreateSession(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		requestBody    models.CreateSessionRequest
		expectedStatus int
	}{
		{
			name: "valid session",
			requestBody: models.CreateSessionRequest{
				Title:       "AI Workshop",
				Description: "Learn about AI",
				Time:        "10:00 AM",
				Duration:    "1 hour",
				SpeakerIDs:  []string{},
			},
			expectedStatus: http.StatusCreated,
		},
		{
			name: "missing title",
			requestBody: models.CreateSessionRequest{
				Description: "Learn about AI",
				Time:        "10:00 AM",
				Duration:    "1 hour",
			},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService, err := services.NewFirestoreService()
			if err != nil {
				t.Skipf("Skipping test: Firestore not available: %v", err)
			}
			handler := NewSessionHandler(mockService)

			router := gin.New()
			router.POST("/api/admin/sessions", handler.CreateSession)

			body, _ := json.Marshal(tt.requestBody)
			req, _ := http.NewRequest("POST", "/api/admin/sessions", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

