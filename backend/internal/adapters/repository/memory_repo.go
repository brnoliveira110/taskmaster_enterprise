package repository

import (
	"errors"
	"sync"
	"taskmaster-backend/internal/core/domain"
)

type TodoMemoryRepo struct {
	todos map[string]domain.Todo
	mu    sync.RWMutex
}

func NewTodoMemoryRepo() *TodoMemoryRepo {
	return &TodoMemoryRepo{
		todos: make(map[string]domain.Todo),
	}
}

func (r *TodoMemoryRepo) GetAll() ([]domain.Todo, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	todos := make([]domain.Todo, 0, len(r.todos))
	for _, t := range r.todos {
		todos = append(todos, t)
	}
	return todos, nil
}

func (r *TodoMemoryRepo) GetByID(id string) (*domain.Todo, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if t, ok := r.todos[id]; ok {
		return &t, nil
	}
	return nil, errors.New("todo not found")
}

func (r *TodoMemoryRepo) Create(todo domain.Todo) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.todos[todo.ID] = todo
	return nil
}

func (r *TodoMemoryRepo) Update(todo domain.Todo) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.todos[todo.ID]; !ok {
		return errors.New("todo not found")
	}
	r.todos[todo.ID] = todo
	return nil
}

func (r *TodoMemoryRepo) Delete(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.todos, id)
	return nil
}

type CategoryMemoryRepo struct {
	categories map[string]domain.Category
	mu         sync.RWMutex
}

func NewCategoryMemoryRepo() *CategoryMemoryRepo {
	return &CategoryMemoryRepo{
		categories: make(map[string]domain.Category),
	}
}

func (r *CategoryMemoryRepo) GetAll() ([]domain.Category, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	categories := make([]domain.Category, 0, len(r.categories))
	for _, c := range r.categories {
		categories = append(categories, c)
	}
	return categories, nil
}

func (r *CategoryMemoryRepo) GetByID(id string) (*domain.Category, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if c, ok := r.categories[id]; ok {
		return &c, nil
	}
	return nil, errors.New("category not found")
}

func (r *CategoryMemoryRepo) Create(category domain.Category) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.categories[category.ID] = category
	return nil
}

func (r *CategoryMemoryRepo) Delete(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.categories, id)
	return nil
}
