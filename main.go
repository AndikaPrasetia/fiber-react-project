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

	// Menambahkan route POST untuk path "/api/todos"
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		// Membuat pointer ke struct Todo
		todo := &Todo{}

		// Mengurai body request ke dalam struct Todo
		if err := c.BodyParser(todo); err != nil {
			// Mengembalikan error jika terjadi kesalahan saat parsing body
			return err
		}

		// Memeriksa apakah field Body kosong
		if todo.Body == "" {
			// Mengembalikan status 400 dan pesan error jika Body kosong
			return c.Status(400).JSON(fiber.Map{
				"error": "Body is required",
			})
		}

		// Mengatur ID todo berdasarkan panjang slice todos
		todo.ID = len(todos) + 1

		// Menambahkan todo baru ke slice todos
		todos = append(todos, *todo)
		// Mengembalikan status 201 dan JSON dari todo yang baru dibuat
		return c.Status(201).JSON(todo)
	})

	// Menjalankan server pada port 8080 dan log error jika terjadi
	log.Fatal(app.Listen(":8080"))
}
