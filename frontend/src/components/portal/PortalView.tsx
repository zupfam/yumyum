import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { PortalResponse, Brand, Dish } from '../../types';
import { MapPin, Star, Zap, ChevronRight, Play } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { PartnerSearch } from '../shared/PartnerSearch';

export function PortalView() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    }
  }, []);

  const { data, isLoading } = useQuery<PortalResponse>({
    queryKey: ['portal', coords],
    queryFn: async () => {
      const params = coords ? `?lat=${coords.lat}&lng=${coords.lng}` : '';
      const response = await api.get(`/public/portal${params}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Search Header */}
      <section className="px-4 py-8 text-center bg-mesh rounded-b-[40px] mb-8">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground mb-6">
          Find <span className="text-primary italic">Street Food</span> Near You
        </h1>
        <PartnerSearch />
        
        {/* Cuisine Chips */}
        <div className="flex gap-2 overflow-x-auto mt-8 pb-2 scrollbar-hide px-2">
           {['All', 'Panipuri', 'Momos', 'Dosa', 'Chai', 'Biryani', 'Rolls', 'Dessert'].map(tag => (
              <button 
                key={tag}
                className={`px-5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${tag === 'All' ? 'bg-primary text-white border-primary shadow-lg shadow-orange-100' : 'bg-white text-gray-500 border-orange-50 hover:border-primary hover:text-primary'}`}
              >
                {tag}
              </button>
           ))}
        </div>
      </section>

      {/* Popular Section */}
      {data?.popular && data.popular.length > 0 && (
        <section className="px-4">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold font-heading">Popular in Bangalore</h2>
              <p className="text-gray-500 text-sm">Most visited this week</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {data.popular.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </section>
      )}

      {/* Reels Section */}
      {data?.reels && data.reels.length > 0 && (
        <section className="bg-gray-900 py-10 text-white overflow-hidden">
          <div className="px-4 mb-6">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <Play className="h-6 w-6 text-primary fill-current" />
              Street Food Reels
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
            {data.reels.map((dish) => (
              <ReelCard key={dish.id} dish={dish as any} />
            ))}
          </div>
        </section>
      )}

      {/* Nearest Section */}
      {data?.nearest && data.nearest.length > 0 && (
        <section className="px-4">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold font-heading">Near You</h2>
              <p className="text-gray-500 text-sm">Active vendors within walking distance</p>
            </div>
            <button 
              onClick={() => {
                // Open a map with all markers
                const markers = data.nearest.map(({brand}) => `${brand.latitude},${brand.longitude}`).join('|');
                window.open(`https://www.google.com/maps/dir/?api=1&waypoints=${markers}`, '_blank');
              }}
              className="text-primary text-xs font-bold uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-full"
            >
              View All on Map
            </button>
          </div>
          <div className="grid gap-6">
            {data.nearest.map(({ brand, distance_km }) => (
              <div key={brand.id} className="relative group">
                <Link 
                  to="/$vendorSlug" 
                  params={{ vendorSlug: brand.slug }}
                  className="flex gap-4 bg-white p-4 rounded-3xl border border-orange-50 shadow-sm active:scale-[0.98] transition-all"
                >
                  <img 
                    src={brand.logo_url} 
                    alt={brand.name} 
                    className="w-24 h-24 rounded-2xl object-cover shadow-inner"
                  />
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{brand.name}</h3>
                      <div className="flex items-center text-xs font-bold text-primary bg-orange-50 px-2 py-1 rounded-full">
                        <Zap className="h-3 w-3 mr-1 fill-current" />
                        LIVE
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">{brand.cuisine}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-400 font-medium">
                      <MapPin className="h-3 w-3 mr-1" />
                      {distance_km} km away
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                </Link>
                
                {/* Fast Action: Directions */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${brand.latitude},${brand.longitude}`, '_blank');
                  }}
                  className="absolute bottom-4 right-12 bg-white p-2 rounded-full shadow-md border border-gray-100 text-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <MapPin className="h-5 w-5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link 
      to="/$vendorSlug" 
      params={{ vendorSlug: brand.slug }}
      className="min-w-[280px] group"
    >
      <div className="relative h-48 rounded-[32px] overflow-hidden mb-3">
        <img 
          src={brand.logo_url} 
          alt={brand.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-200 mb-1">
                <Star className="h-3 w-3 fill-current" />
                {brand.view_count} views
              </div>
              <h3 className="font-bold text-xl leading-tight">{brand.name}</h3>
            </div>
            {!brand.is_active_now && (
              <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                Closed
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 pl-2">{brand.cuisine}</p>
    </Link>
  );
}

function ReelCard({ dish }: { dish: Dish & { vendor_slug: string } }) {
  return (
    <Link 
      to="/$vendorSlug" 
      params={{ vendorSlug: dish.vendor_slug }}
      className="min-w-[160px] h-[280px] relative rounded-3xl overflow-hidden group"
    >
      <img 
        src={dish.image_url || '/placeholder.png'} 
        alt={dish.name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
      <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-full p-2">
         <Play className="h-4 w-4 text-white fill-current" />
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-white font-bold text-sm leading-tight drop-shadow-md">{dish.name}</p>
      </div>
    </Link>
  );
}
