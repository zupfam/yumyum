import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import api from '../lib/api';
import { Dish } from '../types';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  Image as ImageIcon, 
  Play, 
  Loader2,
  Tag,
  DollarSign,
  Sparkles,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DEFAULT_DISH_IMAGE } from '../lib/constants';

export const Route = createFileRoute('/dashboard/menu' as any)({
  component: MenuManager,
})

function MenuManager() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    image_url: DEFAULT_DISH_IMAGE,
    video_url: '',
    is_veg: true
  });

  const { data: dishes, isLoading } = useQuery<Dish[]>({
    queryKey: ['vendor-dishes'],
    queryFn: async () => {
      const response = await api.get('/vendor/me/dishes');
      return response.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (dish: typeof newDish) => {
      const response = await api.post('/vendor/me/dishes', dish);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-dishes'] });
      setIsAdding(false);
      setNewDish({ name: '', price: 0, category: '', description: '', image_url: '', video_url: '', is_veg: true });
    }
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Cool Header */}
      <div className="px-6 py-10 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-20">
        <Link to="/dashboard" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-300 shadow-sm border border-rose-50 active:scale-90 transition-transform">
           <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="text-center">
          <h1 className="font-heading font-bold text-3xl text-foreground">My Menu</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mt-1">
            {dishes?.length || 0} Delicious Items
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-12 h-12 bg-primary text-white rounded-2xl shadow-xl shadow-rose-200 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <main className="px-6">
        <div className="grid gap-4">
           {dishes?.map((dish, i) => (
             <motion.div 
               key={dish.id} 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="flex gap-4 p-4 bg-white rounded-[32px] border border-rose-100 group shadow-sm"
             >
                <div className="w-20 h-20 rounded-[24px] overflow-hidden bg-rose-50/30 relative flex-shrink-0">
                   {dish.image_url ? (
                     <img src={dish.image_url} className="w-full h-full object-cover" />
                   ) : (
                     <ImageIcon className="h-6 w-6 text-rose-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                   )}
                   {dish.video_url && (
                     <div className="absolute top-1 right-1 bg-primary p-1 rounded-full shadow-lg shadow-rose-200">
                        <Play className="h-2 w-2 text-white fill-current" />
                     </div>
                   )}
                </div>
                <div className="flex-1 flex flex-col justify-center overflow-hidden">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dish.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
                      <h3 className="font-bold text-foreground truncate text-lg">{dish.name}</h3>
                   </div>
                   <div className="flex items-center gap-3 mt-1">
                      <p className="text-primary font-bold">₹{dish.price}</p>
                      <span className="w-1 h-1 bg-rose-100 rounded-full" />
                      <span className="text-[10px] uppercase font-bold text-rose-300 tracking-widest truncate">{dish.category}</span>
                   </div>
                </div>
                <button className="w-10 h-10 self-center text-rose-200 hover:text-red-500 transition-colors bg-rose-50/30 rounded-xl flex items-center justify-center">
                   <Trash2 className="h-5 w-5" />
                </button>
             </motion.div>
           ))}

           {dishes?.length === 0 && (
             <div className="py-32 text-center space-y-6">
                <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mx-auto text-rose-100 shadow-sm border border-rose-50">
                   <Sparkles className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <p className="text-foreground font-bold text-xl">Menu is empty</p>
                  <p className="text-rose-900/40 text-sm max-w-[200px] mx-auto">Start adding some delicious food to your digital storefront!</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="h-14 rounded-2xl bg-primary text-white font-bold px-8 shadow-xl shadow-rose-100">
                  Add First Dish
                </Button>
             </div>
           )}
        </div>
      </main>

      {/* Cool Add Dish Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-[425px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8 space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="relative">
              <DialogTitle className="text-3xl font-heading font-bold text-foreground">Add New Dish</DialogTitle>
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute right-0 top-0 w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-300"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogHeader>

            {/* Live Preview Card */}
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-rose-100 to-primary/20 rounded-[36px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               <div className="relative bg-white p-4 rounded-[32px] border border-rose-50 flex gap-4 shadow-sm">
                  <div className="w-20 h-20 rounded-[24px] bg-rose-50 overflow-hidden flex-shrink-0">
                    {newDish.image_url ? (
                      <img src={newDish.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-rose-200" /></div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-foreground">{newDish.name || 'Dish Name'}</h4>
                    <p className="text-primary font-bold">₹{newDish.price || 0}</p>
                    <span className="text-[10px] uppercase font-bold text-rose-300 tracking-widest mt-1">{newDish.category || 'Category'}</span>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">Dish Name</label>
                    <input 
                      placeholder="e.g. Masala Dosa" 
                      className="w-full h-14 rounded-2xl px-5 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                      value={newDish.name}
                      onChange={e => setNewDish({...newDish, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">Price (₹)</label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-200" />
                       <input 
                         type="number"
                         placeholder="99" 
                         className="w-full h-14 rounded-2xl pl-10 pr-4 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                         value={newDish.price || ''}
                         onChange={e => setNewDish({...newDish, price: parseFloat(e.target.value) || 0})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">Category</label>
                    <div className="relative">
                       <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-200" />
                       <input 
                         placeholder="Snacks" 
                         className="w-full h-14 rounded-2xl pl-10 pr-4 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                         value={newDish.category}
                         onChange={e => setNewDish({...newDish, category: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">Image URL</label>
                 <input 
                   placeholder="https://unsplash.com/..." 
                   className="w-full h-14 rounded-2xl px-5 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                   value={newDish.image_url}
                   onChange={e => setNewDish({...newDish, image_url: e.target.value})}
                 />
              </div>

              <div className="flex items-center justify-between p-4 bg-rose-50/30 rounded-2xl border border-rose-50">
                <span className="font-bold text-foreground">Pure Vegetarian?</span>
                <button 
                  onClick={() => setNewDish({...newDish, is_veg: !newDish.is_veg})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${newDish.is_veg ? 'bg-green-500' : 'bg-rose-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newDish.is_veg ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <Button 
                onClick={() => addMutation.mutate(newDish)}
                disabled={addMutation.isPending || !newDish.name}
                className="w-full h-16 rounded-2xl bg-primary hover:bg-rose-600 text-white font-bold text-lg shadow-xl shadow-rose-100 transition-all active:scale-95"
              >
                {addMutation.isPending ? <Loader2 className="animate-spin" /> : "Save to Menu 🚀"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
