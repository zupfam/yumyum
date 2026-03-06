import { Search, SlidersHorizontal, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import { useFilterStore } from '../../store/use-filter.store';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

export function ControlsBar() {
  const {
    searchQuery,
    setSearchQuery,
    vegOnly,
    toggleVegOnly,
    sortBy,
    setSortBy,
  } = useFilterStore();

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search for something delicious..."
          className="pl-11 pr-4 h-12 bg-gray-50 border-transparent focus:bg-white focus:border-orange-100 rounded-xl transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
            <button 
                onClick={toggleVegOnly}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-bold uppercase tracking-wider",
                    vegOnly 
                        ? "bg-green-50 border-green-200 text-green-700 shadow-sm" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                )}
            >
                <div className={cn(
                    "w-2 h-2 rounded-full",
                    vegOnly ? "bg-green-500 animate-pulse" : "bg-gray-300"
                )} />
                Veg Only
            </button>

            <button 
                onClick={() => setSortBy(sortBy === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white text-gray-500 hover:border-gray-200 text-xs font-bold uppercase tracking-wider transition-all"
            >
                {sortBy === 'asc' ? <ArrowUpAZ className="h-3 w-3" /> : <ArrowDownAZ className="h-3 w-3" />}
                Price: {sortBy === 'asc' ? 'Low' : 'High'}
            </button>
        </div>

        <div className="text-gray-300">
            <SlidersHorizontal className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
