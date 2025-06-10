import { NewsCategory } from '@/types';
import { useEffect, useState } from 'react';

interface CategoryFilterProps {
  categories: NewsCategory[];
  selectedCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  // Update local state when prop changes
  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (category: NewsCategory) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  const capitalizeCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-full transition-colors ${
            activeCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          aria-label={`Filter news by ${category} category`}
          aria-pressed={activeCategory === category}
        >
          {capitalizeCategory(category)}
        </button>
      ))}
    </div>
  );
} 