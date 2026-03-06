import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ShoppingCart, Info, Share2, Heart, MessageCircle } from 'lucide-react'
import { Dish } from '../../../types'
import { useCartStore } from '../../../store/use-cart.store'
import { Button } from '../../ui/button'
import { cn } from '../../../lib/utils'

interface ReelViewProps {
  dishes: Dish[]
  categories: string[]
  activeIndex: number
  isReelViewOpen: boolean
  closeReelView: () => void
  setActiveIndex: (index: number) => void
}

export function ReelView({
  dishes,
  activeIndex,
  isReelViewOpen,
  closeReelView,
  setActiveIndex,
}: ReelViewProps) {
  const { addItem, items } = useCartStore()
  const [showInfo, setShowInfo] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Snap scrolling logic
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      const index = Math.round(el.scrollTop / window.innerHeight)
      if (index !== activeIndex) {
        setActiveIndex(index)
      }
    }

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [activeIndex, setActiveIndex])

  // Scroll to active index on open
  useEffect(() => {
    if (isReelViewOpen && containerRef.current) {
        containerRef.current.scrollTo({
            top: activeIndex * window.innerHeight,
            behavior: 'auto'
        })
    }
  }, [isReelViewOpen])

  if (!isReelViewOpen) return null

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[100] flex flex-col h-dvh overflow-hidden"
    >
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-50 pointer-events-none">
        <button 
          onClick={closeReelView} 
          className="text-white p-2 bg-black/20 backdrop-blur-md rounded-full pointer-events-auto active:scale-90 transition-transform"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full pointer-events-auto border border-white/10">
           <span className="text-white font-bold text-xs uppercase tracking-widest">
              {dishes[activeIndex]?.category}
           </span>
        </div>

        <button className="text-white p-2 bg-black/20 backdrop-blur-md rounded-full pointer-events-auto active:scale-90 transition-transform">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Snap Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {dishes.map((dish, index) => (
          <ReelItem 
            key={dish.id} 
            dish={dish} 
            isActive={index === activeIndex}
            onAddToCart={() => addItem(dish)}
            isInCart={items.some(i => i.id === dish.id)}
            onShowInfo={() => setShowInfo(true)}
          />
        ))}
      </div>

      {/* Info Drawer */}
      <AnimatePresence>
        {showInfo && dishes[activeIndex] && (
          <>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInfo(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 z-[120] shadow-2xl"
            >
                <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
                <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-bold font-heading mb-1">{dishes[activeIndex].name}</h3>
                    <p className="text-primary font-bold">₹{dishes[activeIndex].price}</p>
                </div>
                <button onClick={() => setShowInfo(false)} className="bg-gray-50 p-2 rounded-full">
                    <X className="h-5 w-5 text-gray-400" />
                </button>
                </div>
                <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                        {dishes[activeIndex].description || "No description available for this delicious dish."}
                    </p>
                    <div className="pt-4 flex gap-4">
                        <div className="flex-1 bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
                            <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-1">Dietary</p>
                            <p className="font-bold text-orange-900">{dishes[activeIndex].is_veg ? "Vegetarian" : "Non-Vegetarian"}</p>
                        </div>
                        <div className="flex-1 bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                            <p className="text-[10px] uppercase font-bold text-blue-600 tracking-widest mb-1">Portion</p>
                            <p className="font-bold text-blue-900">Standard</p>
                        </div>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface ReelItemProps {
    dish: Dish
    isActive: boolean
    onAddToCart: () => void
    isInCart: boolean
    onShowInfo: () => void
}

function ReelItem({ dish, isActive, onAddToCart, isInCart, onShowInfo }: ReelItemProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.play().catch(() => {})
        } else if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }, [isActive])

    return (
        <div className="h-dvh w-full relative snap-start overflow-hidden flex flex-col items-center justify-center bg-gray-900">
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
                {dish.video_url ? (
                    <video
                        ref={videoRef}
                        src={dish.video_url}
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                    />
                )}
                {/* Immersive Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-32 flex flex-col gap-8 z-20">
                <button className="flex flex-col items-center gap-1 group">
                    <div className="bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/10 group-active:scale-90 transition-transform">
                        <Heart className="h-7 w-7 text-white fill-none group-hover:text-red-500 transition-colors" />
                    </div>
                    <span className="text-white text-[10px] font-bold uppercase tracking-tighter shadow-sm">Love</span>
                </button>
                
                <button 
                    onClick={onAddToCart}
                    className="flex flex-col items-center gap-1 group"
                >
                    <div className={cn(
                        "p-3 rounded-full border transition-all duration-300 group-active:scale-90 shadow-lg",
                        isInCart 
                            ? "bg-primary border-primary" 
                            : "bg-black/20 backdrop-blur-md border-white/10"
                    )}>
                        <ShoppingCart className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-white text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                        {isInCart ? "Added" : "Add"}
                    </span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                    <div className="bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/10 group-active:scale-90 transition-transform">
                        <MessageCircle className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-white text-[10px] font-bold uppercase tracking-tighter shadow-sm">Ask</span>
                </button>

                <button 
                    onClick={onShowInfo}
                    className="flex flex-col items-center gap-1 group"
                >
                    <div className="bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/10 group-active:scale-90 transition-transform text-white/80">
                        <Info className="h-7 w-7" />
                    </div>
                    <span className="text-white text-[10px] font-bold uppercase tracking-tighter shadow-sm">Details</span>
                </button>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black/90 to-transparent z-10">
                <div className="flex flex-col gap-2 max-w-[70%]">
                    <div className="flex items-center gap-2">
                        <h2 className="text-white text-3xl font-bold font-heading tracking-tight leading-none">
                            {dish.name}
                        </h2>
                        {dish.is_veg && (
                             <div className="border border-green-500 p-0.5 rounded-sm">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                             </div>
                        )}
                    </div>
                    <p className="text-white/70 text-lg font-bold">₹{dish.price}</p>
                    {dish.tag && (
                        <div className="flex mt-1">
                            <span className="bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-lg">
                                {dish.tag}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tap to add feedback animation placeholder */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                {/* We can add heart particles or subtle flash here on double tap */}
            </div>
        </div>
    )
}
