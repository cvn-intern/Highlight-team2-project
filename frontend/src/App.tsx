import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Homepage from "./pages/home";
import PlayingGameScreen from "@/pages/play";
import { Suspense, useEffect } from "react";
import { useSocketStore } from "./common/stores/socketStore";
import { io } from "socket.io-client";
// import { useTranslation } from "react-i18next";
// import AlertDialogYesNo from "@/common/components/AlertDialogYesNo";

const client = new QueryClient();

function App() {
  // const { i18n, t } = useTranslation();

  // const onChangeLang = (lang_code: "vn" | "en") => {
  //   i18n.changeLanguage(lang_code);
  // };
  const {socket, initSocket} = useSocketStore()

  useEffect(() => {
    const timeout = setTimeout(() => {
      const socketInit = io("http://localhost:3001", {
        extraHeaders: {
          authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTY4OTE1NTc1MywiZXhwIjoxNjg5MjQyMTUzfQ.M0MIO3wNWsJF9lqLQl8kmXCs50TR1sDpJIZiaNPAlnk`,
        },
      });
      initSocket(socketInit)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  console.log({socket})

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
            <Route path="/:roomId" element={<PlayingGameScreen />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
