import React, { useMemo } from 'react';
import { TodoItem } from './TodoItem';
import { Category, Todo } from '../types';
import { Virtuoso, GroupedVirtuoso } from 'react-virtuoso';

interface TodoListProps {
    sortedTodos: Todo[];
    isGroupedByCategory: boolean;
    categories: Category[];
}

export const TodoList: React.FC<TodoListProps> = ({
    sortedTodos,
    isGroupedByCategory,
    categories,
}) => {
    // Memoize grouped data calculation
    const { groupedTodos, groupCounts, groupNames } = useMemo(() => {
        if (!isGroupedByCategory) {
            return { groupedTodos: [], groupCounts: [], groupNames: [] };
        }

        const groups: { name: string; todos: Todo[]; color: string }[] = [];

        // Categories
        categories.forEach(cat => {
            const catTodos = sortedTodos.filter(t => t.categoryIds.includes(cat.id));
            if (catTodos.length > 0) {
                groups.push({
                    name: cat.name,
                    todos: catTodos,
                    color: cat.color
                });
            }
        });

        // Uncategorized
        const uncategorized = sortedTodos.filter(t => t.categoryIds.length === 0);
        if (uncategorized.length > 0) {
            groups.push({
                name: 'Uncategorized',
                todos: uncategorized,
                color: 'bg-gray-200 text-gray-800'
            });
        }

        const flattened = groups.flatMap(g => g.todos);
        const counts = groups.map(g => g.todos.length);
        const names = groups.map(g => ({ name: g.name, color: g.color, count: g.todos.length }));

        return { groupedTodos: flattened, groupCounts: counts, groupNames: names };
    }, [sortedTodos, isGroupedByCategory, categories]);

    if (sortedTodos.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>No tasks found matching your filters.</p>
            </div>
        );
    }

    if (isGroupedByCategory) {
        return (
            <GroupedVirtuoso
                style={{ height: '600px' }}
                groupCounts={groupCounts}
                itemContent={(index) => (
                    <div className="pb-2">
                        <TodoItem todo={groupedTodos[index]} />
                    </div>
                )}
                groupContent={(index) => {
                    const group = groupNames[index];
                    return (
                        <div className="py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                <span className={`w-3 h-3 rounded-full ${group.color.split(' ')[0]}`}></span>
                                {group.name} <span className="text-xs font-normal">({group.count})</span>
                            </h3>
                        </div>
                    );
                }}
            />
        );
    }

    return (
        <Virtuoso
            style={{ height: '600px' }}
            totalCount={sortedTodos.length}
            itemContent={(index) => (
                <div className="pb-2">
                    <TodoItem todo={sortedTodos[index]} />
                </div>
            )}
        />
    );
};
