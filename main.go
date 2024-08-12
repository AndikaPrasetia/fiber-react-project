package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Todo struct {
	ID        int    `json:"id"`
	Completed bool   `json:"completed"`
	Body      string `json:"body"`
}

func main() {

	fmt.Println("Hello, World!")

	// Membuat instance baru dari aplikasi Fiber
	app := fiber.New()

	// Memuat file .env
	err := godotenv.Load(".env")
	// Memeriksa apakah terjadi kesalahan saat memuat file .env
	if err != nil {
		// Menampilkan pesan error dan menghentikan program jika terjadi kesalahan
		log.Fatal("Error loading .env file")
	}

	// Mengambil nilai dari variabel lingkungan PORT
	PORT := os.Getenv("PORT")

	// Inisialisasi slice kosong untuk menyimpan daftar todo
	todos := []Todo{}

	// Menambahkan route GET untuk path "/"
	app.Get("/api/todos", func(c *fiber.Ctx) error {

		// Mengembalikan status 200 dan JSON response
		return c.Status(200).JSON(todos)
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

	// Menambahkan route PUT untuk path "/api/todos/:id"
	app.Put("/api/todos/:id", func(c *fiber.Ctx) error {
		// Mengambil parameter id dari URL
		id := c.Params("id")

		// Melakukan iterasi pada slice todos
		for i, todo := range todos {
			// Memeriksa apakah ID todo sama dengan id yang diambil dari URL
			if fmt.Sprintf("%d", todo.ID) == id {
				// Menandai todo sebagai selesai
				todos[i].Completed = true
				// Mengembalikan status 200 dan JSON dari todo yang telah diperbarui
				return c.Status(200).JSON(todos[i])
			}
		}

		// Mengembalikan status 404 dan pesan error jika todo tidak ditemukan
		return c.Status(404).JSON(fiber.Map{
			"error": "Todo not found",
		})
	})

	// Menambahkan route DELETE untuk path "/api/todos/:id"
	app.Delete("/api/todos/:id", func(c *fiber.Ctx) error {
		// Mengambil parameter id dari URL
		id := c.Params("id")
		// Melakukan iterasi pada slice todos
		for i, todo := range todos {
			// Memeriksa apakah ID todo sama dengan id yang diambil dari URL
			if fmt.Sprintf("%d", todo.ID) == id {
				// Menghapus todo dari slice todos
				todos = append(todos[:i], todos[i+1:]...)
				// Mengembalikan status 200 dan pesan bahwa todo telah dihapus
				return c.Status(200).JSON(fiber.Map{
					"message": "Todo deleted",
				})
			}
		}

		// Mengembalikan status 404 dan pesan error jika todo tidak ditemukan
		return c.Status(404).JSON(fiber.Map{
			"error": "Todo not found",
		})
	})

	// Menjalankan server pada port yang ditentukan
	log.Fatal(app.Listen(":" + PORT))
}
