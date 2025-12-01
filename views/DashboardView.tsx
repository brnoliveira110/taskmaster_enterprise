import React, { Suspense, lazy } from 'react';
import { TodoStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Tag, Loader2 } from '../components/ui/Icons';
import { useDashboardController } from '../controllers/useDashboardController';
import { DashboardControls } from '../components/DashboardControls';
import { TodoList } from '../components/TodoList';

// Lazy load components
const CreateTodoForm = lazy(() => import('../components/CreateTodoForm').then(module => ({ default: module.CreateTodoForm })));
const CategoryManager = lazy(() => import('../components/CategoryManager').then(module => ({ default: module.CategoryManager })));

export const DashboardView = () => {
  const {
    todos,
    filter,
    categories,
    sortBy,
    isGroupedByCategory,
    newCategoryName,
    showCatManager,
    sortedTodos,
    activeCount,
    setFilter,
    setSortBy,
    toggleGroupBy,
    clearCompleted,
    deleteCategory,
    setNewCategoryName,
    setShowCatManager,
    handleAddCategory,
  } = useDashboardController();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={() => setShowCatManager(!showCatManager)}>
            <Tag className="mr-2 h-4 w-4" /> {showCatManager ? 'Hide Categories' : 'Manage Categories'}
          </Button>
        </div>
      </div>

      {/* Category Manager */}
      {showCatManager && (
        <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}>
          <CategoryManager
            categories={categories}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            handleAddCategory={handleAddCategory}
            deleteCategory={deleteCategory}
          />
        </Suspense>
      )}

      <Suspense fallback={<div className="h-20 bg-muted/20 animate-pulse rounded-xl" />}>
        <CreateTodoForm />
      </Suspense>

      <div className="space-y-4">
        {/* Controls Toolbar */}
        <DashboardControls
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isGroupedByCategory={isGroupedByCategory}
          toggleGroupBy={toggleGroupBy}
        />

        {/* Task List Render */}
        <TodoList
          sortedTodos={sortedTodos}
          isGroupedByCategory={isGroupedByCategory}
          categories={categories}
        />

        {/* Footer Actions */}
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t">
          <span>{activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining</span>

          {todos.some(t => t.status === TodoStatus.COMPLETED) && (
            <Button variant="ghost" size="sm" onClick={clearCompleted} className="h-8 text-xs">
              Clear Completed Tasks
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};