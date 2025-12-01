import React, { useState } from 'react';
import { Todo, TodoStatus, Priority } from '../types';
import { useTodoStore } from '../store';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Trash2, Check, Calendar, Layers, ChevronDown, ChevronUp, Plus, X } from './ui/Icons';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = React.memo(({ todo }: TodoItemProps) => {
  const { toggleStatus, deleteTodo, addSubtask, toggleSubtask, deleteSubtask, categories } = useTodoStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingSubtask, setIsEditingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleToggle = () => {
    const newStatus = todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED;
    toggleStatus(todo.id, newStatus);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTodo(todo.id);
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(todo.id, newSubtaskTitle);
      setNewSubtaskTitle('');
      setIsEditingSubtask(false);
    }
  };

  const priorityColor = {
    [Priority.LOW]: 'bg-blue-100 text-blue-800',
    [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [Priority.HIGH]: 'bg-red-100 text-red-800',
  }[todo.priority];

  const categoryColors = todo.categoryIds.map((catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  });

  return (
    <div
      className={`group flex flex-col gap-2 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${todo.status === TodoStatus.COMPLETED ? 'bg-muted/50 border-transparent' : 'bg-card border-border'
        }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${todo.status === TodoStatus.COMPLETED
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-muted-foreground hover:border-primary'
            }`}
        >
          {todo.status === TodoStatus.COMPLETED && <Check className="w-3.5 h-3.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p
                className={`text-sm font-medium leading-none ${todo.status === TodoStatus.COMPLETED ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}
              >
                {todo.title}
              </p>
              {todo.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{todo.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={`${priorityColor} border-0`}>{todo.priority}</Badge>
            {todo.categoryIds.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              if (!cat) return null;
              return (
                <Badge key={cat.id} variant="outline" className={`${cat.color} border-0`}>
                  {cat.name}
                </Badge>
              );
            })}
            {todo.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(todo.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtasks Section */}
      {isExpanded && (
        <div className="pl-8 mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {todo.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 text-sm group/sub">
                <button
                  onClick={() => toggleSubtask(todo.id, subtask.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center ${subtask.isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'
                    }`}
                >
                  {subtask.isCompleted && <Check className="w-3 h-3" />}
                </button>
                <span className={subtask.isCompleted ? 'text-muted-foreground line-through' : ''}>
                  {subtask.title}
                </span>
                <button
                  onClick={() => deleteSubtask(todo.id, subtask.id)}
                  className="opacity-0 group-hover/sub:opacity-100 ml-auto text-destructive/70 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {isEditingSubtask ? (
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Subtask title..."
                className="flex-1 text-sm bg-transparent border-b border-border focus:outline-none focus:border-primary px-1 py-0.5"
                autoFocus
              />
              <Button type="submit" size="sm" className="h-6 text-xs">Add</Button>
              <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsEditingSubtask(false)}>Cancel</Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground hover:text-primary px-0"
              onClick={() => setIsEditingSubtask(true)}
            >
              <Plus className="w-3 h-3 mr-1" /> Add Subtask
            </Button>
          )}
        </div>
      )}
    </div>
  );
});