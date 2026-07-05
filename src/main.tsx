import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AppProvider } from "./contexts/AppContext"
import App from "./App"
import "./styles/globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/">
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
)
