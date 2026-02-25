import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import api from '../lib/api';
import { 
  Plus, 
  Store, 
  Smartphone, 
  MapPin, 
  ExternalLink,
  Loader2,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Utensils
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DEFAULT_BRAND_LOGO, ROLE_SUPERADMIN } from '../lib/constants';

export const Route = createFileRoute('/admin/' as any)({
  component: AdminDashboard,
})

function AdminDashboard() {
  const queryClient = useQueryClient();
  const [isAddingVendor, setIsAddingAddingVendor] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  
  const [newVendor, setNewVendor] = useState({ mobile_number: '', pin: '' });
  const [newBrand, setNewBrand] = useState({ 
    name: '', 
    slug: '', 
    cuisine: '', 
    whatsapp_number: '',
    logo_url: DEFAULT_BRAND_LOGO
  });

  const { data: vendors, isLoading } = useQuery<any[]>({
    queryKey: ['admin-vendors'],
    queryFn: async () => {
      const response = await api.get('/admin/vendors');
      return response.data;
    },
  });

  const vendorMutation = useMutation({
    mutationFn: async (data: typeof newVendor) => {
      const response = await api.post('/admin/vendors', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      setIsAddingAddingVendor(false);
      setNewVendor({ mobile_number: '', pin: '' });
    }
  });

  const brandMutation = useMutation({
    mutationFn: async (data: { vendor_id: string; brand: typeof newBrand }) => {
      const response = await api.post(`/admin/brands/${data.vendor_id}`, data.brand);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      setIsAddingBrand(false);
      setSelectedVendorId(null);
    }
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-4xl font-heading font-bold text-foreground">YumYum Team Dashboard</h2>
           <p className="text-rose-300 font-medium mt-1">Onboard and manage hyperlocal food elite.</p>
        </div>
        <Button 
          onClick={() => setIsAddingAddingVendor(true)}
          className="h-14 rounded-2xl bg-foreground text-white font-bold px-8 shadow-xl active:scale-95 transition-all flex gap-2"
        >
          <Plus className="h-5 w-5" /> New Vendor
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-rose-50 shadow-sm">
            <div className="text-rose-300 text-[10px] font-bold uppercase tracking-widest">Total Vendors</div>
            <div className="text-3xl font-bold text-foreground mt-1">{vendors?.length || 0}</div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-rose-50 shadow-sm">
            <div className="text-rose-300 text-[10px] font-bold uppercase tracking-widest">Active Brands</div>
            <div className="text-3xl font-bold text-foreground mt-1">{vendors?.filter(v => v.brand).length || 0}</div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-rose-50 shadow-sm">
            <div className="text-rose-300 text-[10px] font-bold uppercase tracking-widest">System Health</div>
            <div className="text-3xl font-bold text-green-500 mt-1 flex items-center gap-2">
                100% <CheckCircle2 className="h-6 w-6" />
            </div>
         </div>
      </div>

      {/* Vendors List */}
      <div className="bg-white rounded-[40px] border border-rose-50 shadow-sm overflow-hidden">
         <div className="px-8 py-6 border-b border-rose-50 bg-rose-50/20 flex justify-between items-center">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Store className="h-5 w-5 text-rose-300" />
                Vendor Directory
            </h3>
         </div>
         <div className="divide-y divide-rose-50">
            {vendors?.map((v) => (
                <div key={v.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-rose-50/10 transition-colors">
                    <div className="flex items-center gap-6">
                        {v.brand ? (
                            <img src={v.brand.logo_url} className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-white" />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-200 border-2 border-rose-50 border-dashed">
                                <Utensils className="h-6 w-6" />
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-xl text-foreground">
                                {v.brand?.name || 'Anonymous Vendor'}
                                {v.is_superadmin && <span className="ml-2 px-2 py-0.5 bg-foreground text-white text-[8px] rounded-full uppercase tracking-widest align-middle">Admin</span>}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-400 font-medium">
                                <span className="flex items-center gap-1"><Smartphone className="h-3.5 w-3.5" /> {v.mobile_number}</span>
                                {v.brand && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {v.brand.cuisine}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {v.brand ? (
                            <Button 
                                variant="outline" 
                                className="rounded-xl border-2 border-rose-50 text-rose-300 font-bold hover:bg-rose-50"
                                onClick={() => window.open(`/${v.brand.slug}`, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" /> View Menu
                            </Button>
                        ) : (
                            <Button 
                                className="rounded-xl bg-primary text-white font-bold shadow-lg shadow-rose-100"
                                onClick={() => {
                                    setSelectedVendorId(v.id);
                                    setIsAddingBrand(true);
                                }}
                            >
                                Create Brand
                            </Button>
                        )}
                        <button className="p-2 text-rose-200 hover:text-foreground">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* Add Vendor Dialog */}
      <Dialog open={isAddingVendor} onOpenChange={setIsAddingAddingVendor}>
        <DialogContent className="sm:max-w-[425px] rounded-[40px] p-8 border-none shadow-2xl">
            <DialogHeader>
                <DialogTitle className="text-3xl font-heading font-bold text-foreground">Add Vendor</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">Mobile Number</label>
                    <input 
                        placeholder="10 digit number" 
                        className="w-full h-14 rounded-2xl px-5 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                        value={newVendor.mobile_number}
                        onChange={e => setNewVendor({...newVendor, mobile_number: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">Initial PIN</label>
                    <input 
                        type="password"
                        placeholder="4 digits" 
                        maxLength={4}
                        className="w-full h-14 rounded-2xl px-5 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                        value={newVendor.pin}
                        onChange={e => setNewVendor({...newVendor, pin: e.target.value})}
                    />
                </div>
                <Button 
                    onClick={() => vendorMutation.mutate(newVendor)}
                    disabled={vendorMutation.isPending || !newVendor.mobile_number}
                    className="w-full h-16 rounded-2xl bg-foreground text-white font-bold text-lg shadow-xl shadow-rose-100 transition-all active:scale-95"
                >
                    {vendorMutation.isPending ? <Loader2 className="animate-spin" /> : "Create Account"}
                </Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* Create Brand Dialog */}
      <Dialog open={isAddingBrand} onOpenChange={setIsAddingBrand}>
        <DialogContent className="sm:max-w-[500px] rounded-[40px] p-8 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-3xl font-heading font-bold text-foreground">Create Brand</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">Stall Name</label>
                    <input 
                        placeholder="e.g. Rameshwaram Cafe" 
                        className="w-full h-14 rounded-2xl px-5 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                        value={newBrand.name}
                        onChange={e => {
                            const name = e.target.value;
                            const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                            setNewBrand({...newBrand, name, slug});
                        }}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">URL Slug</label>
                    <input 
                        placeholder="rameshwaram-cafe" 
                        className="w-full h-14 rounded-2xl px-5 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                        value={newBrand.slug}
                        onChange={e => setNewBrand({...newBrand, slug: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">Cuisine</label>
                    <input 
                        placeholder="South Indian, Filter Coffee" 
                        className="w-full h-14 rounded-2xl px-5 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                        value={newBrand.cuisine}
                        onChange={e => setNewBrand({...newBrand, cuisine: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-300 ml-1">WhatsApp Number</label>
                    <input 
                        placeholder="91..." 
                        className="w-full h-14 rounded-2xl px-5 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 font-medium"
                        value={newBrand.whatsapp_number}
                        onChange={e => setNewBrand({...newBrand, whatsapp_number: e.target.value})}
                    />
                </div>
                <Button 
                    onClick={() => brandMutation.mutate({ vendor_id: selectedVendorId!, brand: newBrand })}
                    disabled={brandMutation.isPending || !newBrand.name}
                    className="w-full h-16 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-rose-100 transition-all active:scale-95"
                >
                    {brandMutation.isPending ? <Loader2 className="animate-spin" /> : "Launch Brand 🚀"}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
