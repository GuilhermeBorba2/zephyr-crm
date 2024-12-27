import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CardCustomizationState {
  visibleFields: string[];
  setVisibleFields: (fields: string[]) => void;
}

export const useCardCustomizationStore = create<CardCustomizationState>()(
  persist(
    (set) => ({
      visibleFields: ['title', 'organization', 'value', 'owner', 'tag'],
      setVisibleFields: (fields) => set({ visibleFields: fields }),
    }),
    { name: 'card-customization' }
  )
);