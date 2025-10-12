package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/flippinberger/djmocracy/repo"
	"github.com/labstack/echo/v4"
)

type PartyForm struct {
    Name string `json:"name"`
    Time time.Time `json:"time"`
    Creator string `json:"creator"`
}

type CreatePartyRes struct {
    PartyID string `json:"partyId"`
}
    
func CreateParty(c echo.Context) error {
    var party PartyForm
    if err := c.Bind(&party); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Unable to parse params: %s", err))
    }

    djDB, err := getDB()
    if err != nil {
        return err
    }

    partyId, err := repo.CreateParty(djDB, party.Name, party.Time, party.Creator)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Unable to create Party: %s", err))
    }

    return c.JSON(http.StatusOK, CreatePartyRes{
        PartyID: partyId,
    })
}

type ParamID struct {
    ID string `param:"id"`
}

type PartyRes struct {
    Name string `json:"name"`
    Time time.Time `json:"time"`
    Songs []repo.Song `json:"songs"`
    Creator string `json:"creator"`
    // Owners []string `json:"owners"`
}

func partyToClient(party repo.Party) PartyRes {
    // owners := make([]string, 0, len(party.Owners))
    // for i, ownerObjectId := range party.Owners {
    //     owners[i] = ownerObjectId.Hex()
    // }

    return PartyRes{
        Name: party.Name,
        Time: party.Time,
        Songs: party.Songs,
        Creator: party.Creator.Hex(),
        // Owners: owners,
    }
}

func GetParty(c echo.Context) error {
    var params ParamID
    if err := c.Bind(&params); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Unable to parse params: %s", err))
    }

    djDB, err := getDB()
    if err != nil {
        return err
    }

    party, err := repo.GetParty(djDB, params.ID)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Unable to fetch party: %s", err))
    }

    return c.JSON(http.StatusOK, partyToClient(*party))
}
