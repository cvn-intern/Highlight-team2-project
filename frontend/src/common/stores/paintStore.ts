import { create, StateCreator } from "zustand";

interface PaintSlice {}

const createPaintSlice: StateCreator<PaintSlice> = (set, get) => ({});

export const useExampleStore = create<PaintSlice>();
