package repo

import (
	"context"
	"fmt"
	"time"

	"github.com/flippinberger/djmocracy/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const PartiesCollection = "parties"

func CreateParty(djDB *db.DJDB, name string, time time.Time, owner string) (string, error) {
    ownerID, err := primitive.ObjectIDFromHex(owner)
    if err != nil {
        return "", err
    }

    party := &Party {
        Name: name,
        Time: time,
        Songs: make([]Song, 0, 5),
        Creator: ownerID,
        Owners: make([]primitive.ObjectID, 0, 5),
    }

    res, err := djDB.DB.Collection(PartiesCollection).InsertOne(context.Background(), party)
    if err != nil {
        return "", err
    }

    if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
        return oid.Hex(), nil
    }

    return "", fmt.Errorf("couldn't parse ObjectID to hex string")
}

func GetParty(djDB *db.DJDB, id string) (*Party, error) {
    partyId, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, err
    }

    var party Party
    err = djDB.DB.Collection(PartiesCollection).FindOne(context.Background(), bson.M{"_id": partyId}).Decode(&party)
    if err != nil {
        return nil, err
    }

    return &party, nil
}
