import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayingGameScreen from "@/applications/play/Play";
import { Suspense, useEffect, useState } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import authService from "@/shared/services/authService";
import { useUserStore } from "@/shared/stores/userStore";
import JWTManager from "@/shared/lib/jwt";
import Homepage from "@/applications/home/Page";
import Providers from "./Providers";
import CheckSocketDisconnectedRoute from "./shared/components/CheckSocketDisconnectedRoute";
import WaitingRoom from "./applications/waitingRoom/WaitingRoom";

function App() {
  const [loading, setLoading] = useState(true);
  const { socket, createSocketInstance } = useSocketStore();
  const { setUser } = useUserStore();

  useEffect(() => {
    const initSocket = (token: string) => {
      createSocketInstance(token);
      setLoading(false);
    };

    const initUser = async () => {
      try {
        const { data } = await authService.newUser();
        setUser(data.user);
        JWTManager.setToken(data.accessToken);
        initSocket(data.accessToken);
      } catch (error) {
        console.log(error);
      }
    };

    const token = JWTManager.getToken();
    const user = window.localStorage.getItem("user");

    if (!token && !socket) {
      initUser();
    } else if (token && user) {
      initSocket(token);
      setUser(JSON.parse(user));
    }
  }, []);

  if (loading) return null;

  return (
    <Suspense fallback="loading">
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/123" element={<WaitingRoom />} />
            <Route path="/" element={<Homepage />} />
            <Route
              path="/:codeRoom"
              element={
                <CheckSocketDisconnectedRoute>
                  <PlayingGameScreen />
                </CheckSocketDisconnectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </Providers>
    </Suspense>
  );
}

export default App;
