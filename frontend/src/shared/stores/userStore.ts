import { create } from "zustand";

export interface IUser{
  id: number
  nickname: string
  avatar: string
  language: 'en' | 'vn'
}

interface UserState {
  user: null | IUser
  setUser: (data: IUser) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (data) => {
    set((state) => ({ ...state, user: data }))
    window.localStorage.setItem('user',JSON.stringify(data))
  },
}));