import { Button } from '../../ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../ui/drawer';
import { Brand } from '../../../types';
import { generateWhatsAppLink } from '../../../lib/utils';
import { useCartStore } from '../../../store/use-cart.store';
import { useUIStore } from '../../../store/use-ui.store';
import { X, MessageSquare, CreditCard, Star, ShoppingCart } from 'lucide-react';
import { FeedbackView } from '../feedback/FeedbackView';
import { CartItem } from './CartItem';
import { motion } from 'framer-motion';

interface CartSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand;
}

export function CartSummary({ open, onOpenChange, brand }: CartSummaryProps) {
  const { items } = useCartStore();
  const { openFeedbackView, isFeedbackViewOpen } = useUIStore();
  
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const formatWhatsAppMessage = () => {
    let message = `*Order from ${brand.name}:*\n\n`;
    items.forEach((item) => {
      message += `• ${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total: ₹${total.toFixed(2)}*`;
    return message;
  };

  const handleWhatsAppOrder = () => {
    const message = formatWhatsAppMessage();
    window.open(generateWhatsAppLink(brand.whatsapp_number, message), '_blank');
  };

  const handleUpiPay = () => {
    if (brand.payment_link) {
      window.open(brand.payment_link, '_blank');
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white rounded-t-[32px]">
        <div className="mx-auto w-12 h-1.5 bg-gray-100 rounded-full mt-4 mb-4" />
        
        <div className="px-6 pb-12 max-h-[85vh] overflow-y-auto">
          <DrawerHeader className="px-0 mb-6">
            <div className="flex justify-between items-center w-full">
                <DrawerTitle className="text-3xl font-heading font-bold">Your Order</DrawerTitle>
                <DrawerClose asChild>
                    <button className="bg-gray-50 p-2 rounded-full active:scale-90 transition-transform">
                        <X className="h-6 w-6 text-gray-400" />
                    </button>
                </DrawerClose>
            </div>
            <DrawerDescription className="text-gray-500 text-left mt-1 font-medium">
               {items.length === 0 ? "Add something delicious to start." : `${items.length} unique items selected`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-6 mb-10">
            {items.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-orange-50 text-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                     <ShoppingCart className="h-10 w-10" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nothing here yet</p>
               </div>
            ) : (
              <div className="grid gap-4">
                {items.map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 p-6 rounded-3xl space-y-3">
                 <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Vendor Convenience Fee</span>
                    <span className="text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-sm">Free</span>
                 </div>
                 <div className="h-px bg-gray-200 my-2" />
                 <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
                 </div>
              </div>

              {/* Actions */}
              <div className="grid gap-4">
                <Button 
                    onClick={handleWhatsAppOrder}
                    size="lg"
                    className="w-full h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-xl shadow-green-100 active:scale-95 transition-transform"
                >
                    <MessageSquare className="mr-2 h-6 w-6" /> Place Order on WhatsApp
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-14 rounded-2xl border-2 border-gray-100 font-bold text-gray-700 active:scale-95 transition-transform"
                        onClick={handleUpiPay}
                        disabled={!brand.payment_link}
                    >
                        <CreditCard className="mr-2 h-5 w-5" /> Pay Now
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-14 rounded-2xl border-2 border-gray-100 font-bold text-gray-700 active:scale-95 transition-transform"
                        onClick={openFeedbackView}
                    >
                        <Star className="mr-2 h-5 w-5 text-yellow-400 fill-current" /> Rate Us
                    </Button>
                </div>
              </div>

              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest px-8">
                 Your order will be sent as a WhatsApp message. The vendor will confirm availability.
              </p>
            </div>
          )}
        </div>
        {isFeedbackViewOpen && <FeedbackView brand={brand} />}
      </DrawerContent>
    </Drawer>
  );
}
