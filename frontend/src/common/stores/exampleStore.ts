import { create } from 'zustand'

interface ExampleState {
  value: number
  setValue: (data: number) => void
}

export const useExampleStore = create<ExampleState>((set) => ({
    value: 0,
   setValue: (data) =>  set((state) => ({ ...state, value: data}))
}))