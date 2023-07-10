import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Homepage from './pages/home'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const client = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={client}>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage/>} />
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
