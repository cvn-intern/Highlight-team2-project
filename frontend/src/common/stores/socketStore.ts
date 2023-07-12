import { create } from "zustand";
import { io, Socket } from 'socket.io-client';


interface SocketState {
  socket: null | Socket;
  initSocket: (socketInit: Socket) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  initSocket: (socketInit) => set((state) => ({ ...state, socket: socketInit })),
}));