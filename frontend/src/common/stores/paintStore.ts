import { create, StateCreator } from "zustand";

interface PaintSlice {}

const createPaintSlice: StateCreator<PaintSlice> = (set) => ({
  // States
});

export const useExampleStore = create<PaintSlice>();
