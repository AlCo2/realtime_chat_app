package models

type Chat struct {
	Id       string    `json:"id"`
	Messages []Message `json:"messages"`
}
