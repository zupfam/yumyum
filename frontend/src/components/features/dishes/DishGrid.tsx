import React from 'react';
import { Dish } from '../../../types';
import { useFilterStore } from '../../../store/use-filter.store';
import { DishCard } from './DishCard';
import { motion } from 'framer-motion';

interface DishGridProps {
  dishes: Dish[];
  onDishSelect: (dish: Dish) => void;
}

export function DishGrid({ dishes, onDishSelect }: DishGridProps) {
  const { vegOnly, sortBy, searchQuery } = useFilterStore();

  const filteredAndSortedDishes = React.useMemo(() => {
    let filtered = [...dishes];

    if (vegOnly) {
      filtered = filtered.filter((dish) => dish.is_veg);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(lowercasedQuery) ||
          dish.description?.toLowerCase().includes(lowercasedQuery),
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'asc') {
        return (a.price || 0) - (b.price || 0);
      }
      return (b.price || 0) - (a.price || 0);
    });

    return filtered;
  }, [dishes, vegOnly, sortBy, searchQuery]);

  if (filteredAndSortedDishes.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
         </div>
        <p className="text-sm font-bold uppercase tracking-widest">No matching items</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 md:gap-1">
      {filteredAndSortedDishes.map((dish, index) => (
        <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
        >
            <DishCard dish={dish} onSelect={onDishSelect} />
        </motion.div>
      ))}
    </div>
  );
}
