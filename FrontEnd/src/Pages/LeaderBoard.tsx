import {useState} from "react"
import { useLocation } from "react-router-dom"
import Navbar from "../Components/Navbar"
const LeaderBoard =()=>{
    const location = useLocation()
    const scores = location.state || {}
    console.log(location.state)
    console.log(scores)
    return <div className="bg-black h-screen text-white">
      <Navbar />
      <div>
    <div>
        <div>
          Winner 
        </div>
        <div>
          Created BY
        </div>
    </div>
    <div>
        {scores && (
  <table>
    <thead>
      <tr>
        <th>Player</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
        {Object.entries(scores).map(([player, score], index) => (
          <tr key={index}>
            <td>{player}</td>
            <td>{score as number}</td>
          </tr>
        ))}
    </tbody>
  </table>
)}
    </div>
      </div>
    </div>
}
export default LeaderBoard
