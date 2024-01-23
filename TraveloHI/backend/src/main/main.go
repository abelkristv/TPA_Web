package main

import (
	"backend/src/config"
	"backend/src/controllers"
	"backend/src/seeder"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Seed() {
	seeder.SeedUser()
}

func RESTrouter() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	r.POST("/login", controllers.Login)

	r.Run(":1234")
}

func main() {
	config.InitDB()
	Seed()

	RESTrouter()
}
