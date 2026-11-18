import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource-variable/vazirmatn";
import "styles/variables.css";
import "styles/bootstrap-custom.css"
import "styles/index.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
