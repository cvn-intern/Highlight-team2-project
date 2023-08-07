import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import 'react-toastify/dist/ReactToastify.css';
import "./shared/i18n";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
