import { ShoppingCart } from 'lucide-react';
import { useCartItemsCount, useCartTotal } from '../../store/use-cart.store';
import { useUIStore } from '../../store/use-ui.store';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalCart() {
  const itemCount = useCartItemsCount();
  const total = useCartTotal();
  const { openCartSummary, isReelViewOpen } = useUIStore();

  if (itemCount === 0 || isReelViewOpen) return null;

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[40] w-full max-w-xs px-4"
        >
            <Button
                size="lg"
                className="w-full h-14 rounded-2xl shadow-2xl bg-primary hover:bg-orange-600 text-white flex justify-between items-center px-6 border-2 border-white/20 active:scale-95 transition-transform"
                onClick={openCartSummary}
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-primary">
                            {itemCount}
                        </span>
                    </div>
                    <span className="font-bold text-sm uppercase tracking-widest">View Order</span>
                </div>
                <span className="font-heading text-lg font-bold">₹{total}</span>
            </Button>
        </motion.div>
    </AnimatePresence>
  );
}
