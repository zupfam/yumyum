import { CartSummary } from '../features/cart/CartSummary';
import { CategoryHighlights } from '../features/categories/CategoryHighlights';
import { DishGrid } from '../features/dishes/DishGrid';
import { ReelView } from '../features/reel/ReelView';
import { StatusViewer } from '../features/status/StatusViewer';
import { BrandHeader } from '../shared/BrandHeader';
import { ControlsBar } from '../shared/ControlsBar';
import { GlobalCart } from '../shared/GlobalCart';
import { QRCodeModal } from '../shared/QRCodeModal';
import { Brand, Dish, StatusItem } from '../../types';
import { useUIStore } from '../../store/use-ui.store';
import { useFilterStore } from '../../store/use-filter.store';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientWrapperProps {
  brand: Brand;
  dishes: Dish[];
  statuses: StatusItem[];
}

export function ClientWrapper({
  brand,
  dishes,
  statuses,
}: ClientWrapperProps) {
  // UI State
  const { isReelViewOpen, closeReelView, activeIndex, setActiveIndex, openReelView } =
    useUIStore();
  const { isCartSummaryOpen, closeCartSummary } = useUIStore();
  const { searchQuery } = useFilterStore();

  // Computed values
  const categories = Array.from(new Set(dishes.map((dish) => dish.category)));

  const handleSelectCategory = (category: string) => {
    const dishIndex = dishes.findIndex((d) => d.category === category);
    if (dishIndex >= 0) {
      openReelView(dishIndex);
    }
  };

  const handleSelectDish = (dish: Dish) => {
    const dishIndex = dishes.findIndex((d) => d.id === dish.id);
    if (dishIndex >= 0) {
      openReelView(dishIndex);
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-orange-100 selection:text-primary">
      <GlobalCart />
      
      {/* Immersive Layout */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto min-h-screen pb-24 relative"
      >
        {/* Header Section */}
        <div className="px-4 pt-8 pb-2">
           <BrandHeader brand={brand} hasStatus={!!statuses && statuses.length > 0} />
        </div>

        {/* Stories/Categories Section */}
        <div className="py-4 overflow-hidden border-b border-gray-50">
          <CategoryHighlights
            dishes={dishes}
            onCategorySelect={handleSelectCategory}
          />
        </div>

        {/* Search & Filters */}
        <div className="px-4 py-6 sticky top-0 bg-white/80 backdrop-blur-xl z-20 transition-all duration-300">
          <ControlsBar />
        </div>

        {/* Main Grid */}
        <div className="px-1 md:px-4">
           <DishGrid dishes={dishes} onDishSelect={handleSelectDish} />
        </div>

        {/* Reel View Overlay */}
        <AnimatePresence>
            {isReelViewOpen && (
                <ReelView
                    dishes={dishes}
                    categories={categories}
                    activeIndex={activeIndex}
                    isReelViewOpen={isReelViewOpen}
                    closeReelView={closeReelView}
                    setActiveIndex={setActiveIndex}
                />
            )}
        </AnimatePresence>

        {/* Modals & Overlays */}
        <CartSummary
          open={isCartSummaryOpen}
          onOpenChange={closeCartSummary}
          brand={brand}
        />
        {statuses && statuses.length > 0 && <StatusViewer status={statuses} />}
        <QRCodeModal />
      </motion.div>
    </div>
  );
}
