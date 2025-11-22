package models

type Session struct {
	ID          string   `json:"id" firestore:"-"`
	Title       string   `json:"title" firestore:"title"`
	Description string   `json:"description" firestore:"description"`
	Time        string   `json:"time" firestore:"time"`
	Duration    string   `json:"duration" firestore:"duration"`
	SpeakerIDs  []string `json:"speakerIds" firestore:"speakerIds"`
}

type CreateSessionRequest struct {
	Title       string   `json:"title" binding:"required"`
	Description string   `json:"description"`
	Time        string   `json:"time"`
	Duration    string   `json:"duration"`
	SpeakerIDs  []string `json:"speakerIds"`
}

type UpdateSessionRequest struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Time        string   `json:"time"`
	Duration    string   `json:"duration"`
	SpeakerIDs  []string `json:"speakerIds"`
}

