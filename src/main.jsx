import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FlowStateProvider } from './Context/context'

/**
 * This code renders the App component wrapped in a FlowStateProvider
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <FlowStateProvider>
    <App />
  </FlowStateProvider>,
)
