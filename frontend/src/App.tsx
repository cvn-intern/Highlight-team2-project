import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayingPage from "@/applications/play/Page";
import { Suspense, useEffect, useState } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import authService from "@/shared/services/authService";
import { IUser, useUserStore } from "@/shared/stores/userStore";
import JWTManager from "@/shared/lib/jwt";
import Homepage from "@/applications/home/Page";
import Providers from "./Providers";
import NotFoundPage from "./shared/pages/NotFoundPage";
import UserExistsInBrowserPage from "./shared/pages/UserExistsInBrowserPage";
import { ToastContainer } from "react-toastify";
import RoomsPage from "@/applications/rooms/Page";
import CreateThemePage from "./applications/themes/Page";

function App() {
  const [loading, setLoading] = useState(true);
  const { socket, createSocketInstance } = useSocketStore();
  const { user, setUser } = useUserStore();

  const createNewToken = async () => {
    const {
      data: { user, accessToken },
    } = await authService.newUser();
    setUser(user);
    JWTManager.setToken(accessToken);
    return accessToken;
  };

  useEffect(() => {
    const initPlayer = async () => {
      const token = JWTManager.getToken() ?? (await createNewToken());
      const savedUser = JSON.parse(
        window.sessionStorage.getItem("user")!
      ) as IUser;
      !user && setUser(savedUser);
      !socket && createSocketInstance(token, savedUser!.id);
      setLoading(false);
    };

    initPlayer();
  }, []);


  if (loading) return null;

  return (
    <Suspense fallback="loading">
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/:codeRoom" element={<PlayingPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/create-room/new-theme" element={<CreateThemePage />} />
            <Route
              path="/user/existing"
              element={<UserExistsInBrowserPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="404" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer role="alert" closeButton={false} />
      </Providers>
    </Suspense>
  );
}

export default App;
