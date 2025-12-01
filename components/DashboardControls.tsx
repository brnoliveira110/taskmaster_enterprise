import React from 'react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { TodoStatus } from '../types';

interface DashboardControlsProps {
    filter: TodoStatus | 'ALL';
    setFilter: (filter: TodoStatus | 'ALL') => void;
    sortBy: string;
    setSortBy: (sort: any) => void;
    isGroupedByCategory: boolean;
    toggleGroupBy: () => void;
}

export const DashboardControls: React.FC<DashboardControlsProps> = ({
    filter,
    setFilter,
    sortBy,
    setSortBy,
    isGroupedByCategory,
    toggleGroupBy,
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-2 rounded-lg border">
            {/* Status Filters */}
            <div className="flex space-x-1">
                <Button
                    variant={filter === 'ALL' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('ALL')}
                >
                    All
                </Button>
                <Button
                    variant={filter === TodoStatus.PENDING ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(TodoStatus.PENDING)}
                >
                    Active
                </Button>
                <Button
                    variant={filter === TodoStatus.COMPLETED ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(TodoStatus.COMPLETED)}
                >
                    Completed
                </Button>
            </div>

            {/* Sort & Group Options */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-8 w-32 text-xs"
                >
                    <option value="createdAt">Date Created</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                </Select>

                <div className="h-4 w-px bg-border mx-1" />

                <Button
                    variant={isGroupedByCategory ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={toggleGroupBy}
                >
                    Group by Category
                </Button>
            </div>
        </div>
    );
};
