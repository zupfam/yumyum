import { create } from 'zustand';

interface FilterState {
  vegOnly: boolean;
  sortBy: 'asc' | 'desc';
  searchQuery: string;
  toggleVegOnly: () => void;
  setSortBy: (sortBy: 'asc' | 'desc') => void;
  setSearchQuery: (query: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  vegOnly: false,
  sortBy: 'desc',
  searchQuery: '',
  toggleVegOnly: () => set((state: FilterState) => ({ vegOnly: !state.vegOnly })),
  setSortBy: (sortBy: 'asc' | 'desc') => set({ sortBy }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
