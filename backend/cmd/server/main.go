package main

import (
	"log"
	"net/http"
	"taskmaster-backend/internal/adapters/handler"
	"taskmaster-backend/internal/adapters/repository"
	"taskmaster-backend/internal/core/services"
)

func main() {
	// Repositories
	todoRepo := repository.NewTodoMemoryRepo()
	categoryRepo := repository.NewCategoryMemoryRepo()

	// Services
	todoService := services.NewTodoService(todoRepo)
	categoryService := services.NewCategoryService(categoryRepo)

	// Handlers
	todoHandler := handler.NewTodoHandler(todoService)
	categoryHandler := handler.NewCategoryHandler(categoryService)

	// Router (Simple Mux)
	mux := http.NewServeMux()

	// Middleware (CORS)
	corsMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	}

	// Routes
	mux.HandleFunc("/todos", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			todoHandler.GetTodos(w, r)
		case http.MethodPost:
			todoHandler.CreateTodo(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/todos/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPut:
			todoHandler.UpdateTodo(w, r)
		case http.MethodDelete:
			todoHandler.DeleteTodo(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/categories", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			categoryHandler.GetCategories(w, r)
		case http.MethodPost:
			categoryHandler.CreateCategory(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/categories/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodDelete:
			categoryHandler.DeleteCategory(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	log.Println("Server starting on :8080")
	if err := http.ListenAndServe(":8080", corsMiddleware(mux)); err != nil {
		log.Fatal(err)
	}
}
