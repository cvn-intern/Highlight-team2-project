import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Homepage from "./pages/home";
import PlayingGameScreen from "@/pages/play";
import { Suspense } from "react";
// import { useTranslation } from "react-i18next";

const client = new QueryClient();

function App() {
  // const { i18n, t } = useTranslation();

  // const onChangeLang = (lang_code: "vn" | "en") => {
  //   i18n.changeLanguage(lang_code);
  // };

  return (
    <Suspense fallback="loading">
      <QueryClientProvider client={client}>
        {/* <h1 onClick={() => onChangeLang("vn")}>{t("playgame.board.ul")}</h1> */}
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
