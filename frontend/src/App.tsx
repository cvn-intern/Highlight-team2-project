import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PlayingGameScreen from "@/applications/play/Play";
import { Suspense, useEffect, useState } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { io } from "socket.io-client";
import authService from "@/shared/services/authService";
import { useUserStore } from "@/shared/stores/userStore";
import JWTManager from "@/shared/lib/jwt";
import Homepage from "@/applications/home/Page";
import Providers from "./Providers";

const client = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);
  const { socket, initSocket } = useSocketStore();
  const { setUser } = useUserStore();

  useEffect(() => {
    const createSocketInstance = (token: string) => {
      const socketInit = io(import.meta.env.VITE_REACT_SOCKET_URL as string, {
        extraHeaders: {
          authorization: token,
        },
      });
      initSocket(socketInit);
      setLoading(false);
    };

    const initUser = async () => {
      try {
        const { data } = await authService.newUser();
        setUser(data.user);
        console.log(data);
        JWTManager.setToken(data.accessToken);
        createSocketInstance(data.accessToken);
      } catch (error) {
        console.log(error);
      }
    };

    const token = JWTManager.getToken();
    const user = window.localStorage.getItem("user");
    if (!token && !socket) {
      initUser();
    } else if (token && user) {
      createSocketInstance(token);
      setUser(JSON.parse(user));
    }
  }, []);

  if (loading) return null;

  return (
    <Suspense fallback="loading">
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/:codeRoom" element={<PlayingGameScreen />} />
          </Routes>
        </BrowserRouter>
      </Providers>
    </Suspense >
  );
}

export default App;
