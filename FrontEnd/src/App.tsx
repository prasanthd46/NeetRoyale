import { useState } from 'react'
import Game from "./Pages/Game"
import Home from "../src/Pages/Home"
import WaitingRoom from './Pages/WaitingRoom'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import LeaderBoard from './Pages/LeaderBoard'
function App() {
  

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/waitingroom" element={<WaitingRoom />}/>
      <Route path="/game" element={<Game />}/>
      <Route path="/leaderBoard" element={<LeaderBoard />}/>
    </Routes>
  </BrowserRouter>
  
  )
}

export default App
