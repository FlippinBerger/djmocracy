package repo

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id"`
	Username string             `bson:"username"`
	Password string             `bson:"password"`
}

type Session struct {
	SessionId string `bson:"session_id"`
	UserId    int    `bson:"user_id"`
}

type Party struct {
    Name string `bson:"name"`
    Time time.Time `bson:"time"`
    Songs []Song `bson:"songs"`
    Creator primitive.ObjectID `bson:"creator"`
    Owners []primitive.ObjectID `bson:"owners"`
}

type Song struct {
    Title string `bson:"title" json:"title"`
    Artist string `bson:"artist" json:"artist"`
    AlbumArtURL string `bson:"album_art_url" json:"album_art_url"`
    Votes int `bson:"votes" json:"votes"`
}
