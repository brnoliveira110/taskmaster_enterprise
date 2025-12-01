import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTodoSchema, CreateTodoFormValues } from '../schemas';
import { useTodoStore } from '../store';
import { Priority, TodoStatus } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card, CardContent } from './ui/Card';
import { Plus, Tag } from './ui/Icons';
import { Badge } from './ui/Badge';

export const CreateTodoForm = () => {
  const { addTodo, categories } = useTodoStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTodoFormValues>({
    resolver: zodResolver(CreateTodoSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      categoryIds: [],
      dueDate: '',
    }
  });

  const selectedCategoryIds = watch('categoryIds') || [];

  const toggleCategory = (catId: string) => {
    const current = selectedCategoryIds;
    if (current.includes(catId)) {
      setValue('categoryIds', current.filter(id => id !== catId));
    } else {
      setValue('categoryIds', [...current, catId]);
    }
  };

  const onSubmit = (data: CreateTodoFormValues) => {
    addTodo({
      ...data,
      status: TodoStatus.PENDING,
      userId: 'user-1',
      categoryIds: data.categoryIds || []
    });
    reset({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      categoryIds: [],
      dueDate: '',
    });
  };

  return (
    <Card className="mb-8 border-dashed shadow-none">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex-1 space-y-2">
              <Input
                placeholder="What needs to be done?"
                error={errors.title?.message}
                {...register('title')}
                className="text-lg font-medium"
              />
              <Input
                placeholder="Description (optional)"
                className="text-sm text-muted-foreground"
                {...register('description')}
              />
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex gap-2">
                <Select {...register('priority')} className="w-32" error={errors.priority?.message}>
                  <option value={Priority.LOW}>Low</option>
                  <option value={Priority.MEDIUM}>Medium</option>
                  <option value={Priority.HIGH}>High</option>
                </Select>

                <div className="w-40">
                  <Input
                    type="date"
                    {...register('dueDate')}
                    className="w-full"
                  />
                </div>
              </div>
              <Button type="submit" size="default" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </div>

          {/* Category Selection */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground flex items-center mr-2">
              <Tag className="w-3 h-3 mr-1" /> Categories:
            </span>
            {categories.map(cat => {
              const isSelected = selectedCategoryIds.includes(cat.id);
              return (
                <Badge
                  key={cat.id}
                  variant="custom"
                  className={`cursor-pointer select-none transition-all ${isSelected
                      ? `${cat.color} ring-2 ring-offset-1 ring-ring`
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.name}
                </Badge>
              );
            })}
            {categories.length === 0 && <span className="text-xs text-muted-foreground italic">No categories created yet.</span>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};