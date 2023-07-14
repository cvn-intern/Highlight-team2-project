import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Homepage from "./pages/home";
import PlayingGameScreen from "@/pages/play";
import { Suspense, useEffect, useState } from "react";
import { useSocketStore } from "./common/stores/socketStore";
import { io } from "socket.io-client";
import authService from "./common/lib/services/authService";
import { useUserStore } from "./common/stores/userStore";
// import { useTranslation } from "react-i18next";
// import AlertDialogYesNo from "@/common/components/AlertDialogYesNo";
import JWTManager from "@/common/lib/jwt"

const client = new QueryClient();

function App() {
  // const { i18n, t } = useTranslation();

  // const onChangeLang = (lang_code: "vn" | "en") => {
  //   i18n.changeLanguage(lang_code);
  // };
  const [loading, setLoading] = useState(true)
  const { socket, initSocket } = useSocketStore()
  const { setUser } = useUserStore()

  useEffect(() => {
    const createSocketInstance = (token: string) =>  {
      const socketInit = io("http://localhost:3001", {
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
        {/* <h1 onClick={() => onChangeLang("vn")}>{t("playgame.board.ul")}</h1> */}
        {/* <AlertDialogYesNo
          buttonText="Click me!"
          buttonClassName="w-full"
          buttonVariant={"outline"}
          onYesClick={() => alert("Yes")}
        /> */}
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
