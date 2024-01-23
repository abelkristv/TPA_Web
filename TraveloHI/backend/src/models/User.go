package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Email    string `gorm:"type:varchar(100);unique_index"`
	Password string `gorm:"type:varchar(100)"`
}
