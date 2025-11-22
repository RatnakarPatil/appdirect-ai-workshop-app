package handlers

import (
	"context"
	"net/http"

	"appdirect-ai-workshop/internal/models"
	"appdirect-ai-workshop/internal/services"

	"github.com/gin-gonic/gin"
	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

type SessionHandler struct {
	firestore *services.FirestoreService
}

func NewSessionHandler(firestore *services.FirestoreService) *SessionHandler {
	return &SessionHandler{firestore: firestore}
}

func (h *SessionHandler) GetSessions(c *gin.Context) {
	ctx := context.Background()
	collection := h.firestore.GetCollection("sessions")

	var sessions []models.Session
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

		var session models.Session
		if err := doc.DataTo(&session); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		session.ID = doc.Ref.ID
		sessions = append(sessions, session)
	}

	// Ensure we always return an array, not null
	if sessions == nil {
		sessions = []models.Session{}
	}
	c.JSON(http.StatusOK, sessions)
}

func (h *SessionHandler) CreateSession(c *gin.Context) {
	var req models.CreateSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	collection := h.firestore.GetCollection("sessions")

	session := models.Session{
		Title:       req.Title,
		Description: req.Description,
		Time:        req.Time,
		Duration:    req.Duration,
		SpeakerIDs:  req.SpeakerIDs,
	}

	docRef, _, err := collection.Add(ctx, session)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	session.ID = docRef.ID
	c.JSON(http.StatusCreated, session)
}

func (h *SessionHandler) UpdateSession(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	collection := h.firestore.GetCollection("sessions")
	docRef := collection.Doc(id)

	updates := []firestore.Update{}
	if req.Title != "" {
		updates = append(updates, firestore.Update{Path: "title", Value: req.Title})
	}
	if req.Description != "" {
		updates = append(updates, firestore.Update{Path: "description", Value: req.Description})
	}
	if req.Time != "" {
		updates = append(updates, firestore.Update{Path: "time", Value: req.Time})
	}
	if req.Duration != "" {
		updates = append(updates, firestore.Update{Path: "duration", Value: req.Duration})
	}
	if req.SpeakerIDs != nil {
		updates = append(updates, firestore.Update{Path: "speakerIds", Value: req.SpeakerIDs})
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	_, err := docRef.Update(ctx, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Fetch updated document
	doc, err := docRef.Get(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var session models.Session
	if err := doc.DataTo(&session); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	session.ID = doc.Ref.ID

	c.JSON(http.StatusOK, session)
}

func (h *SessionHandler) DeleteSession(c *gin.Context) {
	id := c.Param("id")
	ctx := context.Background()
	collection := h.firestore.GetCollection("sessions")
	docRef := collection.Doc(id)

	_, err := docRef.Delete(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Session deleted successfully"})
}

