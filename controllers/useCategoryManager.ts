import { useState } from 'react';
import { useTodoStore } from '../store';

const PASTEL_COLORS = [
    'bg-red-100 text-red-800', 'bg-orange-100 text-orange-800',
    'bg-amber-100 text-amber-800', 'bg-green-100 text-green-800',
    'bg-emerald-100 text-emerald-800', 'bg-teal-100 text-teal-800',
    'bg-cyan-100 text-cyan-800', 'bg-blue-100 text-blue-800',
    'bg-indigo-100 text-indigo-800', 'bg-violet-100 text-violet-800',
    'bg-purple-100 text-purple-800', 'bg-fuchsia-100 text-fuchsia-800',
    'bg-pink-100 text-pink-800', 'bg-rose-100 text-rose-800'
];

export const useCategoryManager = () => {
    const { addCategory, deleteCategory } = useTodoStore();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showCatManager, setShowCatManager] = useState(false);

    const handleAddCategory = (e: FormDataEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
        addCategory(newCategoryName, randomColor);
        setNewCategoryName('');
    };

    return {
        newCategoryName,
        setNewCategoryName,
        showCatManager,
        setShowCatManager,
        handleAddCategory,
        deleteCategory,
    };
};
