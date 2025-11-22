package handlers

import (
	"context"
	"net/http"
	"time"

	"appdirect-ai-workshop/internal/models"
	"appdirect-ai-workshop/internal/services"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
)

type AttendeeHandler struct {
	firestore *services.FirestoreService
}

func NewAttendeeHandler(firestore *services.FirestoreService) *AttendeeHandler {
	return &AttendeeHandler{firestore: firestore}
}

type CreateAttendeeRequest struct {
	Name        string `json:"name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Designation string `json:"designation" binding:"required"`
}

func (h *AttendeeHandler) GetAttendees(c *gin.Context) {
	ctx := context.Background()
	collection := h.firestore.GetCollection("attendees")

	var attendees []models.Attendee
	iter := collection.Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		var attendee models.Attendee
		if err := doc.DataTo(&attendee); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		attendee.ID = doc.Ref.ID
		attendees = append(attendees, attendee)
	}

	c.JSON(http.StatusOK, attendees)
}

func (h *AttendeeHandler) GetCount(c *gin.Context) {
	ctx := context.Background()
	collection := h.firestore.GetCollection("attendees")

	count := 0
	iter := collection.Documents(ctx)
	defer iter.Stop()

	for {
		_, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		count++
	}

	c.JSON(http.StatusOK, models.AttendeeCount{Count: count})
}

func (h *AttendeeHandler) CreateAttendee(c *gin.Context) {
	var req CreateAttendeeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	collection := h.firestore.GetCollection("attendees")

	attendee := models.Attendee{
		Name:         req.Name,
		Email:        req.Email,
		Designation:  req.Designation,
		RegisteredAt: time.Now(),
	}

	docRef, _, err := collection.Add(ctx, attendee)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	attendee.ID = docRef.ID
	c.JSON(http.StatusCreated, attendee)
}

