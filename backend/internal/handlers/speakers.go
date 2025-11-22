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

type SpeakerHandler struct {
	firestore *services.FirestoreService
}

func NewSpeakerHandler(firestore *services.FirestoreService) *SpeakerHandler {
	return &SpeakerHandler{firestore: firestore}
}

func (h *SpeakerHandler) GetSpeakers(c *gin.Context) {
	ctx := context.Background()
	collection := h.firestore.GetCollection("speakers")

	var speakers []models.Speaker
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

		var speaker models.Speaker
		if err := doc.DataTo(&speaker); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		speaker.ID = doc.Ref.ID
		speakers = append(speakers, speaker)
	}

	// Ensure we always return an array, not null
	if speakers == nil {
		speakers = []models.Speaker{}
	}
	c.JSON(http.StatusOK, speakers)
}

func (h *SpeakerHandler) CreateSpeaker(c *gin.Context) {
	var req models.CreateSpeakerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	collection := h.firestore.GetCollection("speakers")

	speaker := models.Speaker{
		Name:     req.Name,
		Bio:      req.Bio,
		Avatar:   req.Avatar,
		Sessions: req.Sessions,
	}

	docRef, _, err := collection.Add(ctx, speaker)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	speaker.ID = docRef.ID
	c.JSON(http.StatusCreated, speaker)
}

func (h *SpeakerHandler) UpdateSpeaker(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateSpeakerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	collection := h.firestore.GetCollection("speakers")
	docRef := collection.Doc(id)

	updates := []firestore.Update{}
	if req.Name != "" {
		updates = append(updates, firestore.Update{Path: "name", Value: req.Name})
	}
	if req.Bio != "" {
		updates = append(updates, firestore.Update{Path: "bio", Value: req.Bio})
	}
	if req.Avatar != "" {
		updates = append(updates, firestore.Update{Path: "avatar", Value: req.Avatar})
	}
	if req.Sessions != nil {
		updates = append(updates, firestore.Update{Path: "sessions", Value: req.Sessions})
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

	var speaker models.Speaker
	if err := doc.DataTo(&speaker); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	speaker.ID = doc.Ref.ID

	c.JSON(http.StatusOK, speaker)
}

func (h *SpeakerHandler) DeleteSpeaker(c *gin.Context) {
	id := c.Param("id")
	ctx := context.Background()
	collection := h.firestore.GetCollection("speakers")
	docRef := collection.Doc(id)

	_, err := docRef.Delete(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Speaker deleted successfully"})
}

