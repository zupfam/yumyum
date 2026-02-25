import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Button } from '../ui/button';
import { 
  Utensils, 
  MapPin, 
  MessageSquare, 
  Loader2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_BRAND_LOGO, DEFAULT_COUNTRY_CODE } from '../../lib/constants';

const STEPS = [
  { id: 'identity', title: 'Brand Identity', icon: Utensils },
  { id: 'vibe', title: 'Cuisine & Vibe', icon: Sparkles },
  { id: 'contact', title: 'Get Connected', icon: MessageSquare }
];

export function OnboardingForm() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    cuisine: '',
    whatsapp_number: '',
    logo_url: DEFAULT_BRAND_LOGO
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

  const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      handleNext();
    } else {
      mutation.mutate(formData);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setFormData({ ...formData, name, slug });
  };

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] p-0 shadow-2xl border border-rose-100 max-w-lg mx-auto overflow-hidden"
    >
      {/* Progress Bar */}
      <div className="h-2 bg-rose-50 flex">
         {STEPS.map((_, i) => (
           <div 
             key={i} 
             className={`h-full transition-all duration-500 ${i <= step ? 'bg-primary flex-1' : 'w-0'}`} 
           />
         ))}
      </div>

      <div className="p-8">
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div 
            key={step}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6"
          >
             <Icon className="h-10 w-10" />
          </motion.div>
          <h2 className="text-3xl font-heading font-bold text-foreground">
            {currentStep.title}
          </h2>
          <p className="text-rose-900/40 mt-2 font-bold uppercase tracking-widest text-[10px]">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/60 ml-1">Stall Name</label>
                    <input
                      autoFocus
                      type="text"
                      placeholder="e.g. Bangalore Biryani Point"
                      className="w-full h-16 rounded-2xl px-6 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 transition-all text-xl font-medium"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                    <p className="text-[10px] text-rose-300 font-bold ml-1">
                       Public URL: <span className="text-primary">yumyum.app/{formData.slug || 'your-stall'}</span>
                    </p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/60 ml-1">Primary Cuisine</label>
                    <input
                      autoFocus
                      type="text"
                      placeholder="e.g. South Indian, Street Snacks"
                      className="w-full h-16 rounded-2xl px-6 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 transition-all text-xl font-medium"
                      value={formData.cuisine}
                      onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/60 ml-1">WhatsApp Number</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-xl text-rose-300">{DEFAULT_COUNTRY_CODE}</span>
                      <input
                        autoFocus
                        type="tel"
                        placeholder="9876543210"
                        className="w-full h-16 rounded-2xl pl-16 pr-6 border-2 border-rose-50 focus:border-primary focus:outline-none bg-rose-50/30 transition-all text-xl font-medium"
                        value={formData.whatsapp_number}
                        onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                        required
                      />
                    </div>
                    <p className="text-[10px] text-rose-300 font-bold ml-1">We'll use this for your magic login and orders.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 pt-4">
            {step > 0 && (
              <Button 
                type="button"
                variant="ghost" 
                onClick={handleBack}
                className="h-16 w-16 rounded-2xl border-2 border-rose-50 text-rose-300 hover:text-primary transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="flex-1 h-16 rounded-2xl bg-primary hover:bg-rose-600 text-white font-bold text-lg shadow-xl shadow-rose-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : step === STEPS.length - 1 ? (
                <>Launch Storefront <CheckCircle2 className="h-6 w-6" /></>
              ) : (
                <>Next Step <ChevronRight className="h-6 w-6" /></>
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
