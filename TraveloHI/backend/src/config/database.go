package config

import (
	"backend/src/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	dsn := "host=localhost user=postgres password=z9kk79v4w3 dbname=travelohi port=5432 TimeZone=Asia/Tokyo"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	Migrate()
}

func Migrate() {
	DB.AutoMigrate(&models.User{})
}
