import { Button } from '../../ui/button';
import { Dish } from '../../../types';
import { useCartStore } from '../../../store/use-cart.store';
import { useUIStore } from '../../../store/use-ui.store';
import { motion } from 'framer-motion';
import { Eye, Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: Dish & { quantity: number };
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateItemQuantity } = useCartStore();
  const { openImageViewer } = useUIStore();

  return (
    <div className="group relative">
      <div
        className="bg-white p-4 rounded-[24px] flex items-center justify-between relative z-10 border-2 border-gray-50 group-hover:border-orange-100 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
            {item.image_url && (
                <div 
                    className="w-16 h-16 rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => openImageViewer(item.image_url!)}
                >
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="flex-1">
                <p className="font-bold text-gray-900 leading-tight mb-0.5">{item.name}</p>
                <p className="text-sm font-bold text-primary">₹{item.price}</p>
            </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl">
          <button
            className="h-8 w-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 active:scale-90 transition-transform"
            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
          <button
            className="h-8 w-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform"
            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <button 
            onClick={() => removeItem(item.id)}
            className="ml-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
        >
            <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
