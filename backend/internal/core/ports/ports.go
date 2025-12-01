package ports

import "taskmaster-backend/internal/core/domain"

type TodoRepository interface {
	GetAll() ([]domain.Todo, error)
	GetByID(id string) (*domain.Todo, error)
	Create(todo domain.Todo) error
	Update(todo domain.Todo) error
	Delete(id string) error
}

type CategoryRepository interface {
	GetAll() ([]domain.Category, error)
	GetByID(id string) (*domain.Category, error)
	Create(category domain.Category) error
	Delete(id string) error
}

type TodoService interface {
	GetTodos() ([]domain.Todo, error)
	GetTodo(id string) (*domain.Todo, error)
	CreateTodo(todo domain.Todo) error
	UpdateTodo(id string, todo domain.Todo) error
	DeleteTodo(id string) error
}

type CategoryService interface {
	GetCategories() ([]domain.Category, error)
	CreateCategory(category domain.Category) error
	DeleteCategory(id string) error
}
