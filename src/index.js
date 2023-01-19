import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import { BackdropDataProvider } from './components/context/BackdropDataContext'
import { BoardsDataProvider } from './components/context/BoardsDataContext'
import {AppStateProvider } from './components/context/AppStateContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BoardsDataProvider>
      <BackdropDataProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </BackdropDataProvider>
    </BoardsDataProvider>
  </React.StrictMode>
)
