package repo

import (
	"context"
    "fmt"

	"github.com/flippinberger/djmocracy/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetProfile(djDB *db.DJDB, id string) ([]Party, error) {
    userId, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, err
    }

    var parties []Party
    cur, err := djDB.DB.Collection(PartiesCollection).Find(context.Background(), bson.M{"creator": userId})
    if err != nil {
        return nil, err
    }

    fmt.Println("getting all from cursor")

    if err = cur.All(context.Background(), &parties); err != nil {
        return nil, err
    }

    fmt.Printf("returning parties: %v\n", parties)

    return parties, nil
}
