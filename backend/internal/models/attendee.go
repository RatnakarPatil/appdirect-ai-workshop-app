package models

import (
	"time"
)

type Attendee struct {
	ID           string    `json:"id" firestore:"-"`
	Name         string    `json:"name" firestore:"name"`
	Email        string    `json:"email" firestore:"email"`
	Designation  string    `json:"designation" firestore:"designation"`
	RegisteredAt time.Time `json:"registeredAt" firestore:"registeredAt"`
}

type AttendeeCount struct {
	Count int `json:"count"`
}

type DesignationStats struct {
	Designation string `json:"designation"`
	Count       int    `json:"count"`
}

