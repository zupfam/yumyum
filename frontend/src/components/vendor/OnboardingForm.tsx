import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Button } from '../ui/button';
import { Utensils, Camera, MapPin, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function OnboardingForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    cuisine: '',
    whatsapp_number: '',
    logo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200&h=200'
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/vendor/me/brand', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-brand'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setFormData({ ...formData, name, slug });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[40px] p-8 shadow-2xl border border-orange-50 max-w-lg mx-auto"
    >
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-4 animate-bounce">
           <Sparkles className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-heading font-bold">Welcome Hero!</h2>
        <p className="text-gray-500 mt-2 font-medium">Let's create your digital storefront in 60 seconds.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Slug */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Stall Name</label>
          <div className="relative">
             <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
             <input
               type="text"
               placeholder="e.g. Bangalore Biryani Point"
               className="w-full pl-12 pr-4 h-14 rounded-2xl border-2 border-gray-50 focus:border-primary focus:outline-none bg-gray-50/50 transition-all text-lg"
               value={formData.name}
               onChange={(e) => handleNameChange(e.target.value)}
               required
             />
          </div>
          <p className="text-[10px] text-gray-400 font-bold ml-1">URL: yumyum.app/{formData.slug || 'your-stall'}</p>
        </div>

        {/* Cuisine */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Primary Cuisine</label>
          <div className="relative">
             <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
             <input
               type="text"
               placeholder="e.g. South Indian, Street Snacks"
               className="w-full pl-12 pr-4 h-14 rounded-2xl border-2 border-gray-50 focus:border-primary focus:outline-none bg-gray-50/50 transition-all text-lg"
               value={formData.cuisine}
               onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
               required
             />
          </div>
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">WhatsApp Number</label>
          <div className="relative">
             <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
             <input
               type="tel"
               placeholder="e.g. 919876543210"
               className="w-full pl-12 pr-4 h-14 rounded-2xl border-2 border-gray-50 focus:border-primary focus:outline-none bg-gray-50/50 transition-all text-lg"
               value={formData.whatsapp_number}
               onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
               required
             />
          </div>
          <p className="text-[10px] text-gray-400 font-bold ml-1">For direct customer contact</p>
        </div>

        <Button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full h-16 rounded-2xl bg-primary hover:bg-orange-600 text-white font-bold text-lg shadow-xl shadow-orange-100 transition-all active:scale-95"
        >
          {mutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "Launch My Storefront 🚀"}
        </Button>
      </form>
    </motion.div>
  );
}
