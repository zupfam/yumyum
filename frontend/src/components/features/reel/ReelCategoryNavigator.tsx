import { cn } from '../../../lib/utils';

interface ReelCategoryNavigatorProps {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export function ReelCategoryNavigator({
  categories,
  activeCategory,
  onCategorySelect,
}: ReelCategoryNavigatorProps) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-2 no-scrollbar">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={cn(
            'whitespace-nowrap px-4 py-1 rounded-full text-sm font-medium transition-colors',
            activeCategory === category
              ? 'bg-white text-black'
              : 'bg-black/20 text-white/70 hover:bg-black/40',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
