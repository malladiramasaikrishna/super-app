import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      user: null, // { name, username, email, mobile }
      selectedCategories: [],
      notes: '',
      omdbApiKey: '',

      setUser: (user) => set({ user }),
      setSelectedCategories: (categories) => set({ selectedCategories: categories }),
      setOmdbApiKey: (key) => set({ omdbApiKey: key }),
      
      toggleCategory: (category) => set((state) => {
        const exists = state.selectedCategories.includes(category);
        if (exists) {
          return { selectedCategories: state.selectedCategories.filter((c) => c !== category) };
        } else {
          return { selectedCategories: [...state.selectedCategories, category] };
        }
      }),

      removeCategory: (category) => set((state) => ({
        selectedCategories: state.selectedCategories.filter((c) => c !== category)
      })),

      setNotes: (notes) => set({ notes }),
      
      clearStore: () => set({ user: null, selectedCategories: [], notes: '', omdbApiKey: '' }),
    }),
    {
      name: 'super-app-store',
    }
  )
);
