import React from 'react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Trash2 } from './ui/Icons';
import { Category } from '../types';

interface CategoryManagerProps {
    categories: Category[];
    newCategoryName: string;
    setNewCategoryName: (name: string) => void;
    handleAddCategory: (e: React.FormEvent) => void;
    deleteCategory: (id: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
    categories,
    newCategoryName,
    setNewCategoryName,
    handleAddCategory,
    deleteCategory,
}) => {
    return (
        <Card className="bg-muted/20">
            <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((cat) => (
                        <Badge
                            key={cat.id}
                            variant="custom"
                            className={`${cat.color} pl-2 pr-1 py-1 flex items-center gap-1`}
                        >
                            {cat.name}
                            <button
                                onClick={() => deleteCategory(cat.id)}
                                className="ml-1 hover:text-destructive"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
                <form onSubmit={handleAddCategory} className="flex gap-2 max-w-sm">
                    <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New Category Name..."
                        className="h-8 text-sm"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        variant="secondary"
                        disabled={!newCategoryName.trim()}
                    >
                        Add
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
