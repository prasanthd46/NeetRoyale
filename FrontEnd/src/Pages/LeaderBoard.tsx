import {useState} from "react"
import { useLocation } from "react-router-dom"
import Navbar from "../Components/Navbar"
import { useNavigate } from "react-router-dom"
import CircleQuarter from "../Components/CircleQuarter"
const LeaderBoard =()=>{
    const [flag,setFlag] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const scores = location.state || {}
    console.log(location.state)
    console.log(scores)
    return <div className="bg-black overflow-hidden h-screen text-white">
      <Navbar />
      <div className="h-screen flex justify-center mt-30">
        <div className="flex flex-col  gap-y-20  items-center ">
    <div className="flex  rounded gap-5  items-center w-[800px] ">
      <div onMouseEnter={()=>setFlag(true)} onMouseLeave={()=> setFlag(false)} className="w-[60%] relative border border-[#303030]  p-10 px-7 flex gap-10  items-center rounded">
        <span className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none z-0">  <span className={`absolute top-0 left-0 w-1 h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.9)] transition-all duration-500 group-hover:h-24 ${flag===true?("w-16"):("")} `} />

</span>


          <CircleQuarter flag={flag} rotate={false} />
          <div>
            <div className="font-bold font-mono text-xl">          
              Highest Player Name
            </div>
            <div className={`transition-opacity duration-900 ease-in-out ${flag===true?("font-mono visible opacity-100"):("opacity-0 invisible")}`}>          
              Champion
            </div>
          </div>

      
      </div>
        <div className="w-[40%] hover:scale-100  hover:bg-purple-500 hover:shadow-[0_0_10px_rgba(168,85,247,0.9)]  hover:text-white text-md  transition-all  duration-300 flex flex-col justify-center items-center  border border-[#303030]  w-33 h-33 font-normal rounded ">
          Host By
          <div className="font-light">
              DontKnow
          </div>
        </div>
    </div>
    <div  className="font-mono  border-purple-500 border rounded-lg overflow-hidden">
        
  <table className="    w-[650px] ">
    <thead className="bg-purple-500  shadow-[0_0_10px_rgba(168,85,247,0.9)]  text-white  text-2xl">
      <tr className="">
        <th className=" w-[20%]  px-6 py-10">Rank</th>
        <th className="w-[60%] px-6 py-10">Player</th>
        <th className=" px-6 py-10">Score</th>
      </tr>
    </thead>
    <tbody className="  text-xl">
        {Object.entries(scores).map(([player, score], index) => (
          <tr key={index}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 10px rgba(168,85,247,0.9)";
              e.currentTarget.style.color ="#a855f7"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "none";
              e.currentTarget.style.color ="white"
            }}
            className="hover:text-purple   hover:text-[0_0_10px_rgba(168,85,247,0.9)] text-center w-full divide-y-reverse ">
            <td className="px-4 py-3">{index+1}</td>
            <td className="px-4 py-3">{player}</td>
            <td className="px-4 py-3">{score as number}</td>
          </tr>
        ))}
        <tr  className=" text-center w-full divide-y-reverse ">
            <td className="px-4 py-3">index+1</td>
            <td>playerlkawm</td>
            <td>score as number</td>
          </tr>
       
    </tbody>
  </table>
  



</div>

  <div className="w-full flex justify-end">
      <button type="button" onClick={()=> {navigate('/')}} className="text-white bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.6)] hover:bg-purple-800   font-medium rounded-lg text-sm outline-none px-5 py-2.5 text-center inline-flex items-center dark:bg-purple-600 dark:hover:bg-purple-700">
        Home
        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </button>
    </div>
    </div>
      </div>
    </div>
}
export default LeaderBoard
