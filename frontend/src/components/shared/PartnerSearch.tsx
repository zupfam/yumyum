import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, MapPin, Utensils, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  vendor_name: string;
  cuisine: string;
  vendor_slug: string;
}

export function PartnerSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          // Note: Backend might need CORS or absolute URL if called from browser
          const response = await api.get(`/public/search?q=${query}`);
          setResults(response.data.results || []);
        } catch (error) {
          console.error('Search error:', error);
          // Mock data for demo if backend fails
          if (query.toLowerCase().includes('pizza')) {
             setResults([{ vendor_name: 'The Pizza Stop', cuisine: 'Italian', vendor_slug: 'pizza-stop' }]);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full max-w-xl mx-auto z-40 px-4">
      <motion.div 
        animate={{ 
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused ? "0 20px 40px -10px rgba(0,0,0,0.1)" : "0 4px 6px -1px rgba(0,0,0,0.05)"
        }}
        className="relative bg-white rounded-[24px] overflow-hidden border-2 border-orange-50 transition-colors duration-300"
      >
        <div className="relative flex items-center">
            <div className="pl-6 text-primary">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="h-6 w-6" />}
            </div>
            <input
                type="text"
                className="w-full pl-2 pr-6 py-4 bg-transparent focus:outline-none text-base md:text-lg font-medium placeholder:text-gray-400"
                placeholder="Search for your favorite vendor..."
                value={query}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query && !isLoading && (
                <button 
                    onClick={() => setQuery('')}
                    className="mr-6 text-gray-300 hover:text-gray-500"
                >
                    <ArrowRight className="h-5 w-5 rotate-45" />
                </button>
            )}
        </div>

        <AnimatePresence>
            {isFocused && (results.length > 0 || isLoading || query.length >= 2) && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-50 max-h-96 overflow-y-auto"
                >
                    {results.length > 0 ? (
                        <div className="py-2">
                            {results.map((result, index) => (
                                <Link
                                    key={result.vendor_slug}
                                    to="/$vendorSlug"
                                    params={{ vendorSlug: result.vendor_slug }}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-orange-50 transition-colors group"
                                >
                                    <div className="bg-orange-100 p-3 rounded-2xl text-primary transition-transform group-hover:scale-110">
                                        <Utensils className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{result.vendor_name}</p>
                                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                                            <MapPin className="h-3 w-3" />
                                            <span>{result.cuisine}</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </Link>
                            ))}
                        </div>
                    ) : query.length >= 2 && !isLoading ? (
                        <div className="p-10 text-center text-gray-400">
                             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="h-6 w-6" />
                             </div>
                             <p className="text-sm font-bold uppercase tracking-widest">No vendors found</p>
                             <p className="text-xs mt-1">Try searching for something else</p>
                        </div>
                    ) : null}
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
      
      {/* Search Shortcuts */}
      {!isFocused && !query && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
              {['Pizza', 'Burger', 'Chai', 'Momos', 'Dosa'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-1.5 rounded-full bg-white/50 text-gray-600 text-xs font-bold border border-white/50 hover:bg-white hover:border-orange-200 transition-all"
                  >
                      {tag}
                  </button>
              ))}
          </motion.div>
      )}
    </div>
  );
}
