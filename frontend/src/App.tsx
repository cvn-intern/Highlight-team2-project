import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/home'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'
// import { useTranslation } from 'react-i18next'

const client = new QueryClient()

function App() {
  // const { i18n, t } = useTranslation();

  // const onChangeLang = (lang_code: "vn" | "en") => {
  //   i18n.changeLanguage(lang_code);
  // };

  return (
    <Suspense fallback="loading">
      <QueryClientProvider client={client}>
        {/* <h1 onClick={() => onChangeLang("vn")}>{t("home")}</h1> */}
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Homepage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Suspense >
  )
}

export default App
