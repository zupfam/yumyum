import { Brand } from '../../types';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/use-ui.store';
import { Share2, Info, MapPin, Zap, Instagram, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

interface BrandHeaderProps {
  brand: Brand;
  hasStatus?: boolean;
}

export function BrandHeader({ brand, hasStatus }: BrandHeaderProps) {
  const { openStatusViewer, openQRCodeModal } = useUIStore();

  return (
    <div className="flex flex-col gap-8">
      {/* Dynamic Navigation Bar */}
      <div className="flex justify-between items-center px-1">
         <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col"
         >
            <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-1">Street Food Elite</span>
            <div className="flex items-center gap-1.5 text-gray-400 font-bold uppercase tracking-widest text-[9px]">
               <MapPin className="h-2.5 w-2.5" />
               <span>{brand.city || "Mumbai, IN"}</span>
            </div>
         </motion.div>
         <div className="flex gap-3">
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={openQRCodeModal}
                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100 shadow-sm transition-colors active:bg-orange-50 active:text-primary"
            >
               <Share2 className="h-4 w-4" />
            </motion.button>
            <motion.button 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100 shadow-sm transition-colors active:bg-orange-50 active:text-primary"
            >
               <Info className="h-4 w-4" />
            </motion.button>
         </div>
      </div>

      {/* Profile Identity Section */}
      <div className="flex items-center gap-6 px-1">
        {/* The "Status" Logo Container */}
        <div className="relative group">
            <motion.div
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                    "relative w-28 h-28 rounded-[40px] p-1 cursor-pointer transition-all duration-300",
                    hasStatus 
                        ? "bg-gradient-to-tr from-yellow-400 via-orange-500 to-primary p-[3px] shadow-lg shadow-orange-100 rotate-2 group-hover:rotate-0" 
                        : "bg-gray-100 p-0.5 group-hover:bg-orange-100"
                )}
                onClick={() => hasStatus && openStatusViewer()}
            >
                <div className="w-full h-full rounded-[37px] border-[4px] border-white overflow-hidden bg-white shadow-inner relative z-10">
                    <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                {hasStatus && (
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full border-4 border-white shadow-xl z-20 animate-bounce">
                        <Zap className="h-3 w-3 fill-current" />
                    </div>
                )}
            </motion.div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-heading text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[0.9] drop-shadow-sm"
          >
            {brand.name}
          </motion.h1>
          
          <div className="flex flex-wrap gap-2 mt-1">
             <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-primary text-[10px] font-black uppercase tracking-[0.1em] border border-orange-100 shadow-sm">
                {brand.cuisine}
             </span>
             {brand.whatsapp_number && (
                 <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-[0.1em] border border-green-100 shadow-sm">
                    <Phone className="h-2.5 w-2.5 fill-current" />
                    <span>Active</span>
                 </div>
             )}
          </div>
        </div>
      </div>

      {/* Modern Bio & Social Link */}
      <div className="px-1 space-y-4">
        {brand.description && (
           <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-md italic border-l-2 border-orange-100 pl-4">
             "{brand.description}"
           </p>
        )}
        
        {brand.instagram_url && (
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-3.5 w-3.5" />
                <span>Follow on Instagram</span>
            </button>
        )}
      </div>
    </div>
  );
}
