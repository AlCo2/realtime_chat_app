import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ChatInterface from './components/ChatInterface'
import axios from 'axios';
import './App.css'
import Cookies from 'js-cookie'

function App() {
  const [username, setUsername] = useState(Cookies.get("username") ?? "")

  useEffect(()=> {
    if (username.trim().length < 1) {
      axios.post("http://localhost:8080/session", {}, {withCredentials:true}).then((response) =>setUsername(response.data.username));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              userName={username}
              setUserName={setUsername}
            />
          }
        />
        <Route
          path="/chat/:groupId"
          element={
            username ? (
              <ChatInterface />
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
