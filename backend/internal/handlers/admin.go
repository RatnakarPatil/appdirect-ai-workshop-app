package handlers

import (
	"context"
	"net/http"

	"appdirect-ai-workshop/internal/models"
	"appdirect-ai-workshop/internal/middleware"
	"appdirect-ai-workshop/internal/services"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
)

type AdminHandler struct {
	firestore *services.FirestoreService
}

func NewAdminHandler(firestore *services.FirestoreService) *AdminHandler {
	return &AdminHandler{firestore: firestore}
}

type LoginRequest struct {
	Password string `json:"password" binding:"required"`
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !middleware.VerifyPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	// Set session cookie
	c.SetCookie("admin_session", "authenticated", 3600*24, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

func (h *AdminHandler) GetStats(c *gin.Context) {
	ctx := context.Background()
	collection := h.firestore.GetCollection("attendees")

	// Count by designation
	designationMap := make(map[string]int)
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

		designationMap[attendee.Designation]++
	}

	// Convert to slice
	var stats []models.DesignationStats
	for designation, count := range designationMap {
		stats = append(stats, models.DesignationStats{
			Designation: designation,
			Count:       count,
		})
	}

	c.JSON(http.StatusOK, gin.H{"stats": stats})
}

