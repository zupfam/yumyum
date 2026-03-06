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
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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
    image_url: '',
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

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-8 flex items-center justify-between border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-xl z-20">
        <Link to="/dashboard" className="p-2 bg-gray-50 rounded-full text-gray-400">
           <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="font-heading font-bold text-2xl">Manage Menu</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-orange-100 active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <main className="p-6">
        <div className="grid gap-6">
           <AnimatePresence>
             {isAdding && (
               <motion.div 
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="bg-orange-50/50 p-6 rounded-[32px] border-2 border-orange-100 space-y-4"
               >
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <input 
                          placeholder="Dish Name" 
                          className="w-full h-14 rounded-2xl px-4 border-2 border-white focus:border-primary focus:outline-none"
                          value={newDish.name}
                          onChange={e => setNewDish({...newDish, name: e.target.value})}
                        />
                     </div>
                     <div>
                        <div className="relative">
                           <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                           <input 
                             type="number"
                             placeholder="Price" 
                             className="w-full h-14 rounded-2xl pl-10 pr-4 border-2 border-white focus:border-primary focus:outline-none"
                             value={newDish.price}
                             onChange={e => setNewDish({...newDish, price: parseFloat(e.target.value)})}
                           />
                        </div>
                     </div>
                     <div>
                        <div className="relative">
                           <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                           <input 
                             placeholder="Category" 
                             className="w-full h-14 rounded-2xl pl-10 pr-4 border-2 border-white focus:border-primary focus:outline-none"
                             value={newDish.category}
                             onChange={e => setNewDish({...newDish, category: e.target.value})}
                           />
                        </div>
                     </div>
                  </div>
                  <input 
                    placeholder="Image URL (Unsplash/Cloudinary)" 
                    className="w-full h-14 rounded-2xl px-4 border-2 border-white focus:border-primary focus:outline-none"
                    value={newDish.image_url}
                    onChange={e => setNewDish({...newDish, image_url: e.target.value})}
                  />
                  <input 
                    placeholder="Reel URL (MP4)" 
                    className="w-full h-14 rounded-2xl px-4 border-2 border-white focus:border-primary focus:outline-none"
                    value={newDish.video_url}
                    onChange={e => setNewDish({...newDish, video_url: e.target.value})}
                  />
                  <div className="flex gap-4">
                     <Button variant="ghost" className="flex-1 h-14 rounded-2xl" onClick={() => setIsAdding(false)}>Cancel</Button>
                     <Button className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold" onClick={() => addMutation.mutate(newDish)}>
                        {addMutation.isPending ? <Loader2 className="animate-spin" /> : "Save Dish"}
                     </Button>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           {dishes?.map(dish => (
             <div key={dish.id} className="flex gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100 group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 relative">
                   {dish.image_url ? (
                     <img src={dish.image_url} className="w-full h-full object-cover" />
                   ) : (
                     <ImageIcon className="h-6 w-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                   )}
                   {dish.video_url && (
                     <div className="absolute top-1 right-1 bg-primary p-1 rounded-full"><Play className="h-2 w-2 text-white fill-current" /></div>
                   )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                   <h3 className="font-bold text-gray-900">{dish.name}</h3>
                   <p className="text-primary font-bold text-sm">₹{dish.price}</p>
                   <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">{dish.category}</span>
                </div>
                <button className="p-2 self-center text-gray-300 hover:text-red-500 transition-colors">
                   <Trash2 className="h-5 w-5" />
                </button>
             </div>
           ))}

           {dishes?.length === 0 && !isAdding && (
             <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                   <Plus className="h-10 w-10" />
                </div>
                <p className="text-gray-400 font-medium">Your menu is empty. Start adding some delicious food!</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
