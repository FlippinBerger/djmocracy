package api

import (
	"fmt"
	"net/http"

	"github.com/flippinberger/djmocracy/repo"
	"github.com/labstack/echo/v4"
)

type Profile struct {
    Parties []PartyRes `json:"parties"`
}

func GetProfile(c echo.Context) error {
    var params ParamID
    if err := c.Bind(&params); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Unable to parse params: %s", err))
    }

    djDB, err := getDB()
    if err != nil {
        return err
    }

    profile, err := repo.GetProfile(djDB, params.ID)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Unable to fetch profile: %s", err))
    }

    fmt.Println("right before the make")

    parties := make([]PartyRes, 0, len(profile))
    fmt.Println("profile length is", len(profile))
    fmt.Println("length of parties is", len(parties))
    for _, party := range profile {
        parties = append(parties, partyToClient(party))
    }

    fmt.Println("after the loop")

    return c.JSON(http.StatusOK, parties)
}
