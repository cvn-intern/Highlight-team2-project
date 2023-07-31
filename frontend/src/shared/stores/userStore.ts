import { create } from "zustand";
import JWTManager from "@/shared/lib/jwt"

export interface IUser{
  id: number
  nickname: string
  avatar: string
  language: 'en' | 'vn'
  id_provider: string
  is_guest: boolean
  provider: string
  created_at: Date;
  updated_at: Date;
}

interface UserState {
  user: null | IUser
  setUser: (data: IUser) => void
  deleteUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (data) => {
    set((state) => ({ ...state, user: data }))
    window.sessionStorage.setItem('user',JSON.stringify(data))
  },
  deleteUser: () => {
    set((state) => ({ ...state, user: null }));
    JWTManager.deleteToken()
  },
}));