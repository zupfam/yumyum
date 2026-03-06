import { Dish } from '../../../types';
import { cn } from '../../../lib/utils';
import { useCartStore } from '../../../store/use-cart.store';
import { Heart, ShoppingCart, MessageCircle, Share2 } from 'lucide-react';

interface ReelActionBarProps {
  dish: Dish;
}

export function ReelActionBar({ dish }: ReelActionBarProps) {
  const { addItem, items } = useCartStore();
  const isInCart = items.some((item) => item.id === dish.id);

  return (
    <div className="flex flex-col gap-6 items-center">
      <button className="flex flex-col items-center gap-1 text-white">
        <Heart className="h-8 w-8" />
        <span className="text-xs font-medium">Like</span>
      </button>
      
      <button 
        className={cn(
            "flex flex-col items-center gap-1",
            isInCart ? "text-blue-500" : "text-white"
        )}
        onClick={() => addItem(dish)}
      >
        <ShoppingCart className="h-8 w-8" />
        <span className="text-xs font-medium">{isInCart ? "Added" : "Add"}</span>
      </button>

      <button className="flex flex-col items-center gap-1 text-white">
        <MessageCircle className="h-8 w-8" />
        <span className="text-xs font-medium">Chat</span>
      </button>

      <button className="flex flex-col items-center gap-1 text-white">
        <Share2 className="h-6 w-6" />
        <span className="text-xs font-medium">Share</span>
      </button>
    </div>
  );
}
