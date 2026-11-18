import { create } from "zustand";

export const useMainOffcanvas = create(set => ({
    showOffcanvas: false,
    setShowOffcanvas: value => set({ showOffcanvas: value })
}))
