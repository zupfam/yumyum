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
  ChevronRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { OnboardingForm } from '../components/vendor/OnboardingForm';

export const Route = createFileRoute('/dashboard' as any)({
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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
    </div>
  );

  if (isError || !brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <OnboardingForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl px-6 py-6 border-b border-rose-50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-rose-200">Y</div>
            <div>
              <h1 className="font-heading font-bold text-xl text-foreground">Vendor Hub</h1>
              <p className="text-[8px] font-bold text-rose-300 uppercase tracking-widest leading-none mt-1">YumYum Business</p>
            </div>
          </div>
          <Link to="/dashboard/settings" className="w-10 h-10 flex items-center justify-center text-rose-300 hover:bg-rose-50 rounded-xl transition-colors">
            <Settings className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-8 shadow-sm border border-rose-50 text-center relative overflow-hidden"
        >
          <div className={`w-24 h-24 mx-auto rounded-[32px] mb-6 flex items-center justify-center transition-all duration-700 ${brand?.is_active_now ? 'bg-green-500 text-white shadow-xl shadow-green-100 rotate-12' : 'bg-rose-50 text-rose-200 rotate-0'}`}>
            <Power className="h-12 w-12" />
          </div>
          
          <h2 className="text-3xl font-heading font-bold mb-2 text-foreground">
            {brand?.is_active_now ? "You're Live!" : "Ready to start?"}
          </h2>
          <p className="text-rose-900/40 mb-8 max-w-[200px] mx-auto font-medium text-sm">
            {brand?.is_active_now 
              ? "Customers can now find you on the map." 
              : "Toggle your status to appear for nearby customers."}
          </p>

          <Button 
            size="lg"
            onClick={handleToggleVending}
            disabled={mutation.isPending}
            className={`w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all active:scale-95 ${brand?.is_active_now ? 'bg-foreground hover:bg-rose-950 text-white shadow-rose-100' : 'bg-primary hover:bg-rose-600 text-white shadow-rose-100'}`}
          >
            {mutation.isPending ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : null}
            {brand?.is_active_now ? "Stop Vending" : "Go Live Now"}
          </Button>

          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-500 text-xs font-bold bg-red-50 py-3 rounded-xl border border-red-100">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {brand?.is_active_now && (
             <div className="mt-6 flex items-center justify-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                Broadcasting Location
             </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-[32px] border border-rose-50 shadow-sm"
          >
            <div className="bg-rose-50 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
               <Eye className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-foreground">{brand?.view_count || 0}</div>
            <div className="text-rose-300 text-[10px] font-bold uppercase tracking-widest mt-1">Menu Views</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-[32px] border border-rose-50 shadow-sm"
          >
            <div className="bg-accent/10 text-accent w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
               <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="text-rose-300 text-[10px] font-bold uppercase tracking-widest mt-1">Orders Sent</div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-[32px] border border-rose-50 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-rose-50 bg-rose-50/30 flex items-center justify-between">
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-rose-300">Quick Actions</h3>
            <Sparkles className="h-4 w-4 text-rose-200" />
          </div>
          <div className="divide-y divide-rose-50">
             <button 
                onClick={() => window.open(`/${brand?.slug}`, '_blank')}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-rose-50/30 transition-colors group"
              >
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors"><ExternalLink className="h-5 w-5 text-rose-300" /></div>
                 <span className="font-bold text-foreground">View Public Menu</span>
               </div>
               <ChevronRight className="h-5 w-5 text-rose-200" />
             </button>
             <Link to="/dashboard/menu" className="w-full px-6 py-5 flex justify-between items-center hover:bg-rose-50/30 transition-colors group">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors"><CreditCard className="h-5 w-5 text-rose-300" /></div>
                 <span className="font-bold text-foreground">Manage Menu Items</span>
               </div>
               <ChevronRight className="h-5 w-5 text-rose-200" />
             </Link>
          </div>
        </div>
      </main>

      {/* Logout */}
      <div className="max-w-4xl mx-auto px-6 mt-4">
        <button 
          className="w-full h-16 rounded-2xl border-2 border-rose-50 text-rose-200 font-bold hover:bg-rose-50 transition-colors"
          onClick={() => {
            localStorage.removeItem('token');
            navigate({ to: '/login' });
          }}
        >
          Logout of Hub
        </button>
      </div>
    </div>
  );
}
