package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {

	fmt.Println("Hello, World!!!")
	// Membuat instance baru dari aplikasi Fiber
	app := fiber.New()

	// Menambahkan route GET untuk path "/"
	app.Get("/", func(c *fiber.Ctx) error {
		// Mengembalikan status 200 dan JSON response
		return c.Status(200).JSON(fiber.Map{
			// Pesan yang dikembalikan dalam response
			"message": "It's working with Air! and valid GET request in Postman",
		})
	})

	// Menjalankan server pada port 8080 dan log error jika terjadi
	log.Fatal(app.Listen(":8080"))
}
