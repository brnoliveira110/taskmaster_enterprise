package services

import (
	"taskmaster-backend/internal/core/domain"
	"taskmaster-backend/internal/core/ports"
)

type TodoServiceImpl struct {
	repo ports.TodoRepository
}

func NewTodoService(repo ports.TodoRepository) *TodoServiceImpl {
	return &TodoServiceImpl{repo: repo}
}

func (s *TodoServiceImpl) GetTodos() ([]domain.Todo, error) {
	return s.repo.GetAll()
}

func (s *TodoServiceImpl) GetTodo(id string) (*domain.Todo, error) {
	return s.repo.GetByID(id)
}

func (s *TodoServiceImpl) CreateTodo(todo domain.Todo) error {
	return s.repo.Create(todo)
}

func (s *TodoServiceImpl) UpdateTodo(id string, todo domain.Todo) error {
	todo.ID = id
	return s.repo.Update(todo)
}

func (s *TodoServiceImpl) DeleteTodo(id string) error {
	return s.repo.Delete(id)
}

type CategoryServiceImpl struct {
	repo ports.CategoryRepository
}

func NewCategoryService(repo ports.CategoryRepository) *CategoryServiceImpl {
	return &CategoryServiceImpl{repo: repo}
}

func (s *CategoryServiceImpl) GetCategories() ([]domain.Category, error) {
	return s.repo.GetAll()
}

func (s *CategoryServiceImpl) CreateCategory(category domain.Category) error {
	return s.repo.Create(category)
}

func (s *CategoryServiceImpl) DeleteCategory(id string) error {
	return s.repo.Delete(id)
}
