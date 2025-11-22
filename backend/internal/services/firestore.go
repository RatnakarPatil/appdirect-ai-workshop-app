package services

import (
	"context"
	"os"
	"strings"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)

type FirestoreService struct {
	client    *firestore.Client
	subdocID  string
	projectID string
}

func NewFirestoreService() (*FirestoreService, error) {
	projectID := os.Getenv("FIRESTORE_PROJECT_ID")
	if projectID == "" {
		projectID = "default-project"
	}

	subdocID := os.Getenv("FIRESTORE_SUBDOC_ID")
	if subdocID == "" {
		subdocID = "workshop"
	}

	ctx := context.Background()

	// Initialize Firestore client
	var client *firestore.Client
	var err error

	credentialsPath := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	
	// For Cloud Run and GCP environments, use Application Default Credentials (ADC)
	// Only use service account file if explicitly provided and file exists
	if credentialsPath != "" {
		// If path is relative and starts with ./, try parent directory too
		if strings.HasPrefix(credentialsPath, "./") {
			// Try current directory first
			if _, fileErr := os.Stat(credentialsPath); os.IsNotExist(fileErr) {
				// Try parent directory
				parentPath := "../" + strings.TrimPrefix(credentialsPath, "./")
				if _, fileErr := os.Stat(parentPath); fileErr == nil {
					credentialsPath = parentPath
				} else {
					// File doesn't exist, fall back to ADC (Cloud Run)
					client, err = firestore.NewClient(ctx, projectID)
					if err == nil {
						return &FirestoreService{
							client:    client,
							subdocID:  subdocID,
							projectID: projectID,
						}, nil
					}
				}
			}
		}
		
		// Check if file exists before using it
		if _, fileErr := os.Stat(credentialsPath); fileErr == nil {
			// Use service account file (local development)
			opt := option.WithCredentialsFile(credentialsPath)
			client, err = firestore.NewClient(ctx, projectID, opt)
		} else {
			// File doesn't exist, fall back to ADC (Cloud Run)
			client, err = firestore.NewClient(ctx, projectID)
		}
	} else {
		// Use Application Default Credentials (ADC) - works in Cloud Run
		// This will use the service account attached to the Cloud Run service
		client, err = firestore.NewClient(ctx, projectID)
	}

	if err != nil {
		return nil, err
	}

	return &FirestoreService{
		client:    client,
		subdocID:  subdocID,
		projectID: projectID,
	}, nil
}

func (s *FirestoreService) GetCollection(collectionName string) *firestore.CollectionRef {
	docRef := s.client.Collection("workshop").Doc(s.subdocID)
	return docRef.Collection(collectionName)
}

func (s *FirestoreService) Close() error {
	return s.client.Close()
}

