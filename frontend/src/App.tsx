import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayingPage from "@/applications/play/Page";
import { Suspense, useEffect, useState } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import authService from "@/shared/services/authService";
import { useUserStore } from "@/shared/stores/userStore";
import JWTManager from "@/shared/lib/jwt";
import Homepage from "@/applications/home/Page";
import Providers from "./Providers";
// import CheckSocketDisconnectedRoute from "./shared/components/CheckSocketDisconnectedRoute";
import WaitingRoom from "./applications/waitingRoom/WaitingRoom.component";
import NotFoundPage from "./shared/pages/NotFoundPage";
import UserExistsInBrowserPage from "./shared/pages/UserExistsInBrowserPage";

function App() {
  const [loading, setLoading] = useState(true);
  const { socket, createSocketInstance } = useSocketStore();
  const { setUser } = useUserStore();

  useEffect(() => {
    const initSocket = (token: string, userId: number) => {
      createSocketInstance(token, userId);
      setLoading(false);
    };

    const initUser = async () => {
      try {
        const { data } = await authService.newUser();
        setUser(data.user);
        JWTManager.setToken(data.accessToken);
        initSocket(data.accessToken, data.user.id);
      } catch (error) {
        console.log(error);
      }
    };

    const token = JWTManager.getToken();
    const user = window.localStorage.getItem("user");

    if (!token && !socket) {
      initUser();
    } else if (token && user) {
      setUser(JSON.parse(user));
      initSocket(token, JSON.parse(user).id);
    }
  }, []);

  if (loading) return null;

  return (
    <Suspense fallback="loading">
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/:codeRoom" element={<PlayingPage />} />
            <Route
              path="/user/existing"
              element={<UserExistsInBrowserPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </Providers>
    </Suspense>
  );
}

export default App;
