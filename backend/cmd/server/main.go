package main

import (
	"log"
	"os"

	"appdirect-ai-workshop/internal/handlers"
	"appdirect-ai-workshop/internal/middleware"
	"appdirect-ai-workshop/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from project root
	// Try current directory first, then parent directory
	if err := godotenv.Load(); err != nil {
		if err := godotenv.Load("../.env"); err != nil {
			log.Println("No .env file found, using environment variables")
		}
	}

	// Initialize Firestore service
	firestoreService, err := services.NewFirestoreService()
	if err != nil {
		log.Fatalf("Failed to initialize Firestore: %v", err)
	}

	// Initialize handlers
	attendeeHandler := handlers.NewAttendeeHandler(firestoreService)
	speakerHandler := handlers.NewSpeakerHandler(firestoreService)
	sessionHandler := handlers.NewSessionHandler(firestoreService)
	adminHandler := handlers.NewAdminHandler(firestoreService)

	// Setup router
	router := gin.Default()

	// CORS configuration
	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:5173"
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{corsOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Public routes
	api := router.Group("/api")
	{
		// Attendees
		api.GET("/attendees", attendeeHandler.GetAttendees)
		api.GET("/attendees/count", attendeeHandler.GetCount)
		api.POST("/attendees", attendeeHandler.CreateAttendee)

		// Speakers (public read)
		api.GET("/speakers", speakerHandler.GetSpeakers)

		// Sessions (public read)
		api.GET("/sessions", sessionHandler.GetSessions)

		// Admin login
		api.POST("/admin/login", adminHandler.Login)
	}

	// Protected admin routes
	admin := api.Group("/admin")
	admin.Use(middleware.AdminAuth())
	{
		admin.GET("/stats", adminHandler.GetStats)

		// Speaker management
		admin.POST("/speakers", speakerHandler.CreateSpeaker)
		admin.PUT("/speakers/:id", speakerHandler.UpdateSpeaker)
		admin.DELETE("/speakers/:id", speakerHandler.DeleteSpeaker)

		// Session management
		admin.POST("/sessions", sessionHandler.CreateSession)
		admin.PUT("/sessions/:id", sessionHandler.UpdateSession)
		admin.DELETE("/sessions/:id", sessionHandler.DeleteSession)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

