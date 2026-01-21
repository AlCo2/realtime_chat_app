package models

type Chat struct {
	Id       string   `json:"id"`
	Messages []string `json:"messages"`
}
