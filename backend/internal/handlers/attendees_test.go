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

// In-memory mock for testing
type InMemoryStore struct {
	attendees []models.Attendee
	speakers  []models.Speaker
	sessions  []models.Session
}

func TestAttendeeHandler_CreateAttendee(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		requestBody    interface{}
		expectedStatus int
	}{
		{
			name: "valid attendee",
			requestBody: CreateAttendeeRequest{
				Name:        "John Doe",
				Email:       "john@example.com",
				Designation: "Software Engineer",
			},
			expectedStatus: http.StatusCreated,
		},
		{
			name: "missing name",
			requestBody: map[string]interface{}{
				"email":       "john@example.com",
				"designation": "Software Engineer",
			},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name: "invalid email",
			requestBody: CreateAttendeeRequest{
				Name:        "John Doe",
				Email:       "invalid-email",
				Designation: "Software Engineer",
			},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create a firestore service
			// Note: Tests will skip if Firestore is not available (no credentials)
			mockService, err := services.NewFirestoreService()
			if err != nil {
				t.Skipf("Skipping test: Firestore not available: %v", err)
			}
			handler := NewAttendeeHandler(mockService)

			router := gin.New()
			router.POST("/api/attendees", handler.CreateAttendee)

			body, _ := json.Marshal(tt.requestBody)
			req, _ := http.NewRequest("POST", "/api/attendees", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestAttendeeHandler_GetCount(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService, err := services.NewFirestoreService()
	if err != nil {
		t.Skipf("Skipping test: Firestore not available: %v", err)
	}
	handler := NewAttendeeHandler(mockService)

	router := gin.New()
	router.GET("/api/attendees/count", handler.GetCount)

	req, _ := http.NewRequest("GET", "/api/attendees/count", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.AttendeeCount
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.NotNil(t, response)
	assert.GreaterOrEqual(t, response.Count, 0)
}

