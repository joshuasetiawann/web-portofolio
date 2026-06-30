// Global UI state store (mobile menu, command palette, motion preference).
// Only `motionPreference` is persisted to localStorage via the persist middleware.
"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type MotionPreference = "system" | "reduced" | "full";

interface UIState {
  isMobileMenuOpen: boolean;
  setMobileMenu: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setCommandPalette: (open: boolean) => void;
  motionPreference: MotionPreference;
  setMotionPreference: (preference: MotionPreference) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      setMobileMenu: (open) => set({ isMobileMenuOpen: open }),
      isCommandPaletteOpen: false,
      setCommandPalette: (open) => set({ isCommandPaletteOpen: open }),
      motionPreference: "system",
      setMotionPreference: (preference) => set({ motionPreference: preference }),
    }),
    {
      name: "ui-store",
      storage: createJSONStorage(() => localStorage),
      // Persist only the user's motion preference; ephemeral UI flags reset on load.
      partialize: (state) => ({ motionPreference: state.motionPreference }),
    },
  ),
);
