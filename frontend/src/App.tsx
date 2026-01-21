import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ChatInterface from './components/ChatInterface'
import './App.css'

function App() {
  const [userName, setUserName] = useState('')

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              userName={userName}
              setUserName={setUserName}
            />
          }
        />
        <Route
          path="/chat/:groupId"
          element={
            userName ? (
              <ChatInterface userName={userName} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
