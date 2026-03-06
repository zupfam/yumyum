import React from 'react';
import { Dish } from '../../../types';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';

interface DishCardProps {
  dish: Dish;
  onSelect: (dish: Dish) => void;
}

export function DishCard({ dish, onSelect }: DishCardProps) {
  const hasSpecialTag = dish.tag && dish.tag !== 'normal';

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="relative aspect-square w-full overflow-hidden focus:outline-none group bg-gray-50"
      onClick={() => onSelect(dish)}
      aria-label={`View ${dish.name}`}
    >
      {/* Media Layer */}
      {dish.image_url ? (
        <img
          src={dish.image_url}
          alt={dish.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] uppercase font-bold tracking-tighter text-gray-300">No Image</span>
        </div>
      )}

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

      {/* Interaction Feedback Layer */}
      <div className="absolute inset-0 bg-white/0 group-active:bg-white/10 transition-colors" />

      {/* Badges & Indicators */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
        {hasSpecialTag && (
          <div className="bg-primary/95 text-white text-[8px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm shadow-xl backdrop-blur-md border border-white/10">
            {dish.tag}
          </div>
        )}
        {dish.video_url && (
           <div className="bg-black/20 p-1 rounded-full backdrop-blur-md border border-white/20">
              <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24">
                 <path d="M8 5v14l11-7z" />
              </svg>
           </div>
        )}
      </div>

      {/* Content Info */}
      <div className="absolute bottom-0 left-0 p-2.5 w-full text-left">
        <h3 className="text-white font-bold text-[10px] md:text-[12px] uppercase tracking-wider line-clamp-1 drop-shadow-sm">
           {dish.name}
        </h3>
        <p className="text-white/90 font-black text-[9px] md:text-[11px] mt-0.5">
           ₹{dish.price}
        </p>
      </div>
    </motion.button>
  );
}
