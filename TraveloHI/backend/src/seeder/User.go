package seeder

import (
	"backend/src/config"
	"backend/src/models"
	"crypto/sha256"
	"encoding/hex"
	"log"
)

func HashPassword(password string) string {
	hasher := sha256.New()
	hasher.Write([]byte(password))
	return hex.EncodeToString(hasher.Sum(nil))
}

func SeedUser() {
	users := []models.User{
		{Name: "Abel", Email: "abel@travelohi.com", Password: HashPassword("z9kk79v4w3")},
		{Name: "Adrian Yu", Email: "adrianyu@travelohi.com", Password: HashPassword("hehe")},
	}

	for _, user := range users {
		var existingUser models.User
		result := config.DB.Where("email = ?", user.Email).First(&existingUser)

		if result.Error == nil {
			log.Printf("User already exists: %s\n", user.Email)
			continue // Skip to the next user
		}

		createResult := config.DB.Create(&user)
		if createResult.Error != nil {
			log.Printf("Failed to seed user '%s': %s\n", user.Name, createResult.Error)
		} else {
			log.Printf("Seeded user: %s\n", user.Name)
		}
	}
}
