import { useState, useRef, useEffect } from 'react';
import { Dish } from '../../../types';
import { useCartStore } from '../../../store/use-cart.store';

interface MediaDisplayProps {
  dish: Dish;
  isActive: boolean;
}

export function MediaDisplay({ dish, isActive }: MediaDisplayProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDoubleTap = () => {
    addItem(dish);
    // Visual feedback logic could go here
  };

  return (
    <div 
      className="relative w-full h-full"
      onDoubleClick={handleDoubleTap}
    >
      {dish.video_url ? (
        <video
          src={dish.video_url}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isActive && isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          autoPlay={isActive}
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
        />
      ) : (
        <img
          src={dish.image_url}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
      )}
      {!isVideoLoaded && dish.video_url && (
         <img
           src={dish.image_url}
           alt={dish.name}
           className="absolute inset-0 w-full h-full object-cover"
         />
      )}
    </div>
  );
}
