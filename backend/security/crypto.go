package security

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"io"
)

const keyHex = "d2c0ee104cbea8fc27a437a79967a3f749bd0daf8aa64afa8a2fc89bafff3406"

func Encrypt(value string) string {
	key, err := hex.DecodeString(keyHex)
	if err != nil {
		panic(err)
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err)
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err)
	}

	nonce := make([]byte, aesgcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		panic(err)
	}

	ciphertext := aesgcm.Seal(nil, nonce, []byte(value), nil)

	result := append(nonce, ciphertext...)

	return hex.EncodeToString(result)
}

func Decrypt(value string) string {
	key, err := hex.DecodeString(keyHex)
	if err != nil {
		panic(err)
	}

	data, err := hex.DecodeString(value)
	if err != nil {
		panic(err)
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err)
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err)
	}

	nonceSize := aesgcm.NonceSize()
	if len(data) < nonceSize {
		panic("ciphertext too short")
	}

	nonce := data[:nonceSize]
	ciphertext := data[nonceSize:]

	plaintext, err := aesgcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		panic(err)
	}

	return string(plaintext)
}
