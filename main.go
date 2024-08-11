package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

type Todo struct {
	ID    int    `json:"id"`
	Title string `json:"completed"`
	Body  string `json:"body"`
}

func main() {

	fmt.Println("Hello, World!")

	// Membuat instance baru dari aplikasi Fiber
	app := fiber.New()

	todos := []Todo{}

	// Menambahkan route GET untuk path "/"
	app.Get("/", func(c *fiber.Ctx) error {

		// Mengembalikan status 200 dan JSON response
		return c.Status(200).JSON(fiber.Map{

			// Pesan yang dikembalikan dalam response
			"message": "It's working with Air! and valid GET request in Postman",
		})
	})

	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}

		if todo.Body == "" {
			return c.Status(400).JSON(fiber.Map{
				"error": "Body is required",
			})
		}

		todo.ID = len(todos) + 1

		todos = append(todos, *todo)
		return c.Status(201).JSON(todo)
	})
	// Menjalankan server pada port 8080 dan log error jika terjadi
	log.Fatal(app.Listen(":8080"))
}
