package models

import "time"

type Message struct {
	Id             string    `json:"id"`
	Text           string    `json:"text"`
	SenderId       string    `json:"sender_id"`
	SenderUsername string    `json:"sender_username"`
	Timestamp      time.Time `json:"timestamp"`
}
