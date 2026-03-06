import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Brand } from '../types';
import { 
  ChevronLeft, 
  Camera, 
  Save, 
  Loader2,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Phone
} from 'lucide-react';
import { Button } from '../components/ui/button';

export const Route = createFileRoute('/dashboard/settings' as any)({
  component: BrandSettings,
})

function BrandSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Brand>>({});

  const { data: brand, isLoading } = useQuery<Brand>({
    queryKey: ['vendor-brand'],
    queryFn: async () => {
      const response = await api.get('/vendor/me/brand');
      return response.data;
    },
  });

  useEffect(() => {
    if (brand) setFormData(brand);
  }, [brand]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<Brand>) => {
      // Backend should support PATCH /vendor/me/brand
      const response = await api.post('/vendor/me/brand', data); // Reuse POST for now or update backend
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-brand'] });
      alert('Profile updated successfully!');
    }
  });

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-6 py-8 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-20">
        <Link to="/dashboard" className="p-2 bg-gray-50 rounded-full text-gray-400">
           <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="font-heading font-bold text-xl">Stall Settings</h1>
        <Button 
          onClick={() => mutation.mutate(formData)}
          disabled={mutation.isPending}
          className="bg-primary text-white font-bold rounded-xl h-10 px-4"
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save
        </Button>
      </div>

      <main className="p-6 space-y-8 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
           <div className="relative group">
              <img 
                src={formData.logo_url || 'https://via.placeholder.com/150'} 
                className="w-32 h-32 rounded-[40px] object-cover border-4 border-white shadow-xl"
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-2xl shadow-lg shadow-orange-100 active:scale-95 transition-transform">
                 <Camera className="h-5 w-5" />
              </button>
           </div>
           <h2 className="mt-4 font-bold text-xl">{formData.name}</h2>
           <p className="text-gray-400 text-sm">yumyum.app/{formData.slug}</p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
           <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Basic Information</h3>
           <div className="space-y-4">
              <div>
                 <label className="text-xs font-bold text-gray-500 mb-1 block ml-1">Stall Name</label>
                 <input 
                    className="w-full h-12 rounded-xl px-4 border-2 border-gray-50 focus:border-primary focus:outline-none bg-gray-50/50"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 mb-1 block ml-1">Cuisine / Tags</label>
                 <input 
                    className="w-full h-12 rounded-xl px-4 border-2 border-gray-50 focus:border-primary focus:outline-none bg-gray-50/50"
                    value={formData.cuisine || ''}
                    onChange={e => setFormData({...formData, cuisine: e.target.value})}
                 />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 mb-1 block ml-1">WhatsApp Number</label>
                 <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        className="w-full h-12 rounded-xl pl-10 pr-4 border-2 border-gray-50 focus:border-primary focus:outline-none bg-gray-50/50"
                        value={formData.whatsapp_number || ''}
                        onChange={e => setFormData({...formData, whatsapp_number: e.target.value})}
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
           <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Social Media</h3>
           <div className="space-y-4">
              <div className="relative">
                 <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-500" />
                 <input 
                    placeholder="Instagram URL"
                    className="w-full h-12 rounded-xl pl-10 pr-4 border-2 border-gray-50 focus:border-primary focus:outline-none bg-gray-50/50"
                    value={formData.instagram_url || ''}
                    onChange={e => setFormData({...formData, instagram_url: e.target.value})}
                 />
              </div>
              <div className="relative">
                 <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                 <input 
                    placeholder="Payment Link (UPI/Razorpay)"
                    className="w-full h-12 rounded-xl pl-10 pr-4 border-2 border-gray-50 focus:border-primary focus:outline-none bg-gray-50/50"
                    value={formData.payment_link || ''}
                    onChange={e => setFormData({...formData, payment_link: e.target.value})}
                 />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
