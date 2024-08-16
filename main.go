package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Todo struct merepresentasikan sebuah todo item
type Todo struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // identifikasi unik untuk setiap todo
	Completed bool               `json:"completed"`                          // menunjukkan status penyelesaian todo
	Body      string             `json:"body"`                               // deskripsi dari todo
}

// Deklarasi variabel global untuk koleksi MongoDB
var collection *mongo.Collection

func main() {
	// Memuat file .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	// Mengambil URI MongoDB dari variabel env
	mongoURI := os.Getenv("MONGO_URI")
	// Mengatur opsi klien MongoDB dengan URI yang diambil
	clientOptions := options.Client().ApplyURI(mongoURI)
	// Menghubungkan ke MongoDB dengan opsi klien yang telah diatur
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		// Menampilkan log kesalahan dan menghentikan program jika terjadi kesalahan saat menghubungkan ke MongoDB
		log.Fatal(err)
	}

	// Menutup koneksi MongoDB saat aplikasi berhenti
	defer client.Disconnect(context.Background())

	// Memeriksa koneksi ke MongoDB
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	// Mengatur koleksi MongoDB
	collection = client.Database("golang_db").Collection("todos")

	// Membuat instance Fiber
	app := fiber.New()

	// Menggunakan middleware CORS untuk mengizinkan semua domain
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Menambahkan rute untuk mendapatkan semua todo
	app.Get("/todos", getTodos)
	app.Post("/todos", createTodo)
	app.Put("/todos/:id", updateTodo)
	app.Delete("/todos/:id", deleteTodo)

	// Mengambil port dari variabel env, default ke 8080 jika tidak ada
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Menjalankan server pada port yang ditentukan
	log.Fatal(app.Listen("0.0.0.0:" + port))
}

func getTodos(c *fiber.Ctx) error {
	// Mendeklarasikan variabel todos sebagai slice dari Todo
	var todos []Todo

	// Mencari semua dokumen dalam koleksi
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		// Mengembalikan error jika terjadi kesalahan saat mencari dokumen
		return err
	}

	// Menutup cursor setelah selesai digunakan
	defer cursor.Close(context.Background())

	// Iterasi melalui cursor
	for cursor.Next(context.Background()) {
		// Mendeklarasikan variabel todo sebagai instance dari Todo
		var todo Todo
		// Mendekode dokumen dari cursor ke dalam variabel todo
		cursor.Decode(&todo)
		// Menambahkan todo ke dalam slice todos
		todos = append(todos, todo)
	}

	// Mengembalikan todos dalam format JSON
	return c.JSON(todos)
}

func createTodo(c *fiber.Ctx) error {
	// Membuat instance baru dari Todo
	todo := new(Todo)
	// Mengurai body dari request ke dalam instance todo
	if err := c.BodyParser(todo); err != nil {
		// Mengembalikan error jika terjadi kesalahan saat mengurai body
		return err
	}

	// Memeriksa apakah body dari todo kosong
	if todo.Body == "" {
		// Mengembalikan status 400 dan pesan error jika body kosong
		return c.Status(400).JSON(fiber.Map{
			"error": "Todo body cannot be empty",
		})
	}

	// Menyisipkan todo baru ke dalam koleksi MongoDB
	insertResult, err := collection.InsertOne(context.Background(), todo)
	if err != nil {
		// Mengembalikan error jika terjadi kesalahan saat menyisipkan todo
		return err
	}

	// Mengatur ID todo dengan ID yang dihasilkan dari MongoDB
	todo.ID = insertResult.InsertedID.(primitive.ObjectID)

	// Mengembalikan todo yang baru dibuat dalam format JSON
	return c.JSON(todo)
}

// Fungsi untuk memperbarui todo
func updateTodo(c *fiber.Ctx) error {
	// Mendapatkan ID dari parameter URL
	id := c.Params("id")
	// Mengonversi ID dari string ke ObjectID
	objectId, err := primitive.ObjectIDFromHex(id)

	// Memeriksa apakah terjadi kesalahan saat mengonversi ID
	if err != nil {
		// Mengembalikan status 400 dan pesan error jika ID tidak valid
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid ID",
		})
	}

	// Membuat filter untuk mencari todo berdasarkan ID
	filter := bson.M{"_id": objectId}
	// Membuat update untuk mengatur field "completed" menjadi true
	update := bson.M{"$set": bson.M{"completed": true}}

	// Memperbarui satu dokumen yang sesuai dengan filter
	_, err = collection.UpdateOne(context.Background(), filter, update)
	// Memeriksa apakah terjadi kesalahan saat memperbarui dokumen
	if err != nil {
		// Mengembalikan error jika terjadi kesalahan
		return err
	}

	// Mengembalikan status 200 dan pesan sukses jika todo berhasil diperbarui
	return c.Status(200).JSON(fiber.Map{
		"message": "Todo updated successfully",
	})
}

// Fungsi untuk menghapus todo
func deleteTodo(c *fiber.Ctx) error {
	// Mendapatkan ID dari parameter URL
	id := c.Params("id")
	// Mengonversi ID dari string ke ObjectID
	objectId, err := primitive.ObjectIDFromHex(id)

	// Memeriksa apakah terjadi kesalahan saat mengonversi ID
	if err != nil {
		// Mengembalikan status 400 dan pesan error jika ID tidak valid
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid ID",
		})
	}

	// Menghapus satu dokumen yang sesuai dengan filter
	_, err = collection.DeleteOne(context.Background(), bson.M{"_id": objectId})
	// Memeriksa apakah terjadi kesalahan saat menghapus dokumen
	if err != nil {
		// Mengembalikan error jika terjadi kesalahan
		return err
	}

	// Mengembalikan status 200 dan pesan sukses jika todo berhasil dihapus
	return c.Status(200).JSON(fiber.Map{
		"message": "Todo deleted successfully",
	})
}
