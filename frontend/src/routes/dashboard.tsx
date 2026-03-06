import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import api from '../lib/api';
import { Brand } from '../types';
import { 
  MapPin, 
  Power, 
  Eye, 
  ExternalLink, 
  Settings, 
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { OnboardingForm } from '../components/vendor/OnboardingForm';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { data: brand, isLoading, isError } = useQuery<Brand>({
    queryKey: ['vendor-brand'],
    queryFn: async () => {
      const response = await api.get('/vendor/me/brand');
      return response.data;
    },
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async (vars: { is_active_now: boolean; lat?: number; lng?: number }) => {
      const response = await api.post('/vendor/me/status', {
        is_active_now: vars.is_active_now,
        latitude: vars.lat,
        longitude: vars.lng
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-brand'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to update status');
    }
  });

  const handleToggleVending = () => {
    if (brand?.is_active_now) {
      mutation.mutate({ is_active_now: false });
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            mutation.mutate({ 
              is_active_now: true, 
              lat: pos.coords.latitude, 
              lng: pos.coords.longitude 
            });
          },
          (err) => {
            console.error(err);
            setError('Location access denied. Please enable GPS to start vending.');
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
      }
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
    </div>
  );

  if (isError || !brand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <OnboardingForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-6 py-6 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">Y</div>
            <h1 className="font-heading font-bold text-xl">Vendor Hub</h1>
          </div>
          <Link to="/dashboard/settings" className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <Settings className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 text-center"
        >
          <div className={`w-20 h-20 mx-auto rounded-full mb-6 flex items-center justify-center transition-colors duration-500 ${brand?.is_active_now ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <Power className="h-10 w-10" />
          </div>
          
          <h2 className="text-3xl font-heading font-bold mb-2">
            {brand?.is_active_now ? "You're Live!" : "Ready to start?"}
          </h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">
            {brand?.is_active_now 
              ? "Customers can now find you on the Discovery Portal." 
              : "Toggle your status to appear on the map for nearby customers."}
          </p>

          <Button 
            size="lg"
            onClick={handleToggleVending}
            disabled={mutation.isPending}
            className={`w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all active:scale-95 ${brand?.is_active_now ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}
          >
            {mutation.isPending ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : null}
            {brand?.is_active_now ? "Stop Vending" : "Start Vending Now"}
          </Button>

          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-500 text-sm font-medium bg-red-50 py-2 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {brand?.is_active_now && (
             <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <MapPin className="h-3 w-3" />
                Updated just now
             </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-orange-50 text-orange-500 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
               <Eye className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">{brand?.view_count || 0}</div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Menu Views</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-blue-50 text-blue-500 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
               <BarChart3 className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Search Appears</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Quick Actions</h3>
          </div>
          <div className="divide-y divide-gray-50">
             <button 
                onClick={() => window.open(`/${brand?.slug}`, '_blank')}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-gray-100 rounded-lg"><ExternalLink className="h-5 w-5 text-gray-500" /></div>
                 <span className="font-bold text-gray-700">View Public Menu</span>
               </div>
               <ChevronRight className="h-5 w-5 text-gray-300" />
             </button>
             <Link to="/dashboard/menu" className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-gray-100 rounded-lg"><CheckCircle2 className="h-5 w-5 text-gray-500" /></div>
                 <span className="font-bold text-gray-700">Edit Menu Items</span>
               </div>
               <ChevronRight className="h-5 w-5 text-gray-300" />
             </Link>
          </div>
        </div>
      </main>

      {/* Logout etc? */}
      <div className="px-6 mt-4">
        <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold" onClick={() => {
          localStorage.removeItem('token');
          navigate({ to: '/login' });
        }}>
          Logout
        </Button>
      </div>
    </div>
  );
}
