import { create } from "zustand";
import { Socket, io } from 'socket.io-client';


interface SocketState {
  socket: null | Socket;
  initSocket: (socketInit: Socket) => void;
  createSocketInstance: (token: string) => void
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  initSocket: (socketInit) => set((state) => ({ ...state, socket: socketInit })),
  createSocketInstance: (token) => set((state) => {
    const socketInit = io(import.meta.env.VITE_REACT_SOCKET_URL as string, {
      extraHeaders: {
        authorization: token,
      },
      secure: true
    });
    return {...state, socket: socketInit}
  }),
}));