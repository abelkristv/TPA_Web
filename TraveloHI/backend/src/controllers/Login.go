package controllers

import (
	"backend/src/config"
	"backend/src/models"
	"backend/src/seeder"
	"log"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// !IMPORTANT, nanti pindahin ke .env
var jwtSecretKey = []byte("hehe")

type LoginCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func GenerateJWT(email string, userID uint) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["email"] = email
	claims["user_id"] = userID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString(jwtSecretKey)
	return t, err
}

func Login(c *gin.Context) {
	var creds LoginCredentials

	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	result := config.DB.Where("email = ?", creds.Email).First(&user)
	if result.Error != nil || seeder.HashPassword(creds.Password) != user.Password {
		log.Println(seeder.HashPassword(creds.Password))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Credentials"})
		return
	}

	token, err := GenerateJWT(user.Email, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating JWT token"})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	c.JSON(http.StatusOK, gin.H{"message": "Login Successfull", "token": token})
}
