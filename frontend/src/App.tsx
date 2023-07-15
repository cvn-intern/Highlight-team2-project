import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Homepage from "./pages/home";
import PlayingGameScreen from "@/pages/play";
import { Suspense, useEffect, useState } from "react";
import { useSocketStore } from "./common/stores/socketStore";
import { io } from "socket.io-client";
import authService from "./common/lib/services/authService";
import { useUserStore } from "./common/stores/userStore";
import JWTManager from "@/common/lib/jwt"

const client = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true)
  const { socket, initSocket } = useSocketStore()
  const { setUser } = useUserStore()
  console.log(import.meta.env.VITE_REACT_API_URL)
  useEffect(() => {
    const createSocketInstance = (token: string) =>  {
      const socketInit = io(import.meta.env.VITE_REACT_SOCKET_URL as string, {
        extraHeaders: {
          authorization: token,
        },
      })
      initSocket(socketInit)
      setLoading(false)
    }

    const initUser = async () => {
      try {
        const { data } = await authService.newUser()
        setUser(data.data.user)
        JWTManager.setToken(data.data.accessToken)
        createSocketInstance(data.data.accessToken)
      } catch (error) {
        console.log(error)
      }
    }

    const token = JWTManager.getToken()
    const user = window.localStorage.getItem("user")
    if(!token && !socket){
      initUser()
    }
    else if(token && user){
      createSocketInstance(token)
      setUser(JSON.parse(user))
    }
  }, [])

  if(loading) return null

  return (
    <Suspense fallback="loading">
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/:codeRoom" element={<PlayingGameScreen />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
