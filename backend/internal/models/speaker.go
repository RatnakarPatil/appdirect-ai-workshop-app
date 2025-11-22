package models

type Speaker struct {
	ID       string   `json:"id" firestore:"-"`
	Name     string   `json:"name" firestore:"name"`
	Bio      string   `json:"bio" firestore:"bio"`
	Avatar   string   `json:"avatar" firestore:"avatar"`
	Sessions []string `json:"sessions" firestore:"sessions"`
}

type CreateSpeakerRequest struct {
	Name     string   `json:"name" binding:"required"`
	Bio      string   `json:"bio"`
	Avatar   string   `json:"avatar"`
	Sessions []string `json:"sessions"`
}

type UpdateSpeakerRequest struct {
	Name     string   `json:"name"`
	Bio      string   `json:"bio"`
	Avatar   string   `json:"avatar"`
	Sessions []string `json:"sessions"`
}

