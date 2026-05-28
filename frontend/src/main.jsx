import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

/**
 * main.jsx – Application bootstrap
 *
 * ReactDOM.createRoot() – React 18 concurrent mode root
 * BrowserRouter         – Provides HTML5 history-based routing via react-router-dom
 * React.StrictMode      – Highlights potential problems during development (double renders)
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
