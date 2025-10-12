package main

import (
	"net/http"
	"time"

	"github.com/flippinberger/djmocracy/api"
	"github.com/flippinberger/djmocracy/db"
	"github.com/flippinberger/djmocracy/repo"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

    err := db.Connect()
    if err != nil {
        time.Sleep(20 * time.Second)
        err = db.Connect()
        if err != nil {
            panic(err)
        }
    }

    djDB := db.GetDB()
    repo.CreateMongoIndices(djDB)

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173", "http://localhost"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
        AllowCredentials: true,
	}))

	// TODO update secret here with env var secret
	e.Use(session.Middleware(sessions.NewCookieStore([]byte("secret"))))

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, Vue App!")
	})

    // auth endpoints 
	e.POST("/signup", api.Register)
	e.POST("/login", api.LogIn)
	e.POST("/logout", api.LogOut)

    authedG := e.Group("/api")
    authedG.GET("/parties/:id", api.GetParty)
    authedG.POST("/party", api.CreateParty)
    
    authedG.GET("/profiles/:id", api.GetProfile)

	e.Logger.Fatal(e.Start(":1323"))
}
