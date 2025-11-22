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

func TestSpeakerHandler_GetSpeakers(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService, err := services.NewFirestoreService()
	if err != nil {
		t.Skipf("Skipping test: Firestore not available: %v", err)
	}
	handler := NewSpeakerHandler(mockService)

	router := gin.New()
	router.GET("/api/speakers", handler.GetSpeakers)

	req, _ := http.NewRequest("GET", "/api/speakers", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var speakers []models.Speaker
	json.Unmarshal(w.Body.Bytes(), &speakers)
	assert.NotNil(t, speakers)
}

func TestSpeakerHandler_CreateSpeaker(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		requestBody    models.CreateSpeakerRequest
		expectedStatus int
	}{
		{
			name: "valid speaker",
			requestBody: models.CreateSpeakerRequest{
				Name:     "Jane Smith",
				Bio:      "Expert in AI",
				Avatar:   "https://example.com/avatar.jpg",
				Sessions: []string{},
			},
			expectedStatus: http.StatusCreated,
		},
		{
			name: "missing name",
			requestBody: models.CreateSpeakerRequest{
				Bio:    "Expert in AI",
				Avatar: "https://example.com/avatar.jpg",
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
			handler := NewSpeakerHandler(mockService)

			router := gin.New()
			router.POST("/api/admin/speakers", handler.CreateSpeaker)

			body, _ := json.Marshal(tt.requestBody)
			req, _ := http.NewRequest("POST", "/api/admin/speakers", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

