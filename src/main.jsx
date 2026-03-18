import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

/*
  LuminaNexus entry point

  This file does four simple things:
  1. imports React
  2. imports ReactDOM so the app can render in the browser
  3. imports the main App component
  4. imports the global stylesheet
*/

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    'LuminaNexus could not find the root element. Make sure index.html contains <div id="root"></div>.'
  )
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
