import { Dish } from '../../../types';
import { useFilterStore } from '../../../store/use-filter.store';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';

interface CategoryHighlightsProps {
  dishes: Dish[];
  onCategorySelect: (category: string) => void;
}

export function CategoryHighlights({ dishes, onCategorySelect }: CategoryHighlightsProps) {
  const categories = Array.from(new Set(dishes.map((dish) => dish.category)));
  const { searchQuery } = useFilterStore();

  if (searchQuery) return null;

  return (
    <div className="flex gap-6 overflow-x-auto px-4 pb-2 no-scrollbar scroll-smooth">
      {categories.map((category, index) => {
        const firstDishInCategory = dishes.find((d) => d.category === category);
        return (
          <motion.button
            key={category}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onCategorySelect(category)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group outline-none"
          >
            <div className="relative">
               {/* Decorative Ring */}
               <div className="absolute inset-0 rounded-full border-2 border-orange-100 group-active:border-primary transition-colors duration-200" />
               
               <div className="w-18 h-18 rounded-full p-1.5 overflow-hidden">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                    <img
                      src={firstDishInCategory?.image_url || 'https://via.placeholder.com/150'}
                      alt={category}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                    />
                  </div>
               </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700 group-active:text-primary transition-colors">
               {category}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
