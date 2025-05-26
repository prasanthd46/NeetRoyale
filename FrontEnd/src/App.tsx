import { useEffect, useState } from 'react'
import Game from "./Pages/Game"

import Home from "../src/Pages/Home"
import WaitingRoom from './Pages/WaitingRoom'

import LeaderBoard from './Pages/LeaderBoard'
import { Route, Routes } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'




function App() {
 
  return (
    <> 
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/waitingroom" element={<WaitingRoom />} />
      <Route path="/game" element={<Game />} />
      <Route path="/leaderBoard" element={<LeaderBoard />} />
    </Routes></>

  
  )
}

export default App
