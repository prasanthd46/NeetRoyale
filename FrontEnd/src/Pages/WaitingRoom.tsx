import {useState,useEffect} from "react"
import {useNavigate}  from "react-router-dom"
import { getSocket } from "../socket/socket"
import {useAppSelector } from "../Redux/hooks"
const WaitingRoom =()=>{
    const roomId = useAppSelector((state)=> state.socket.roomId)
    const socket = getSocket()
    const startGame = ():Promise<void>=>{
        return new Promise((resolve)=>{
        socket.emit('startGame',roomId)
        resolve()
    })
    }
    const navigate = useNavigate()
    return <div className="bg-black h-screen  ">
        <div className="h-full flex flex-col">
            <div className="bg-[#303030] h-[130px] mt-15 ">{/*Margin could be changed according to ur wish coz i did on spot for functional-priorities completion*/}
                Waiting Room
            </div>
            <div className="border-1 flex flex-col border-[#303030] m-10 h-full ">
                <div className="bg-amber-300 h-full">
                    {

                    }
                </div>
                <div className="bg-white flex justify-end h-[70px]">
                    <div className="">
                        <button className=" bg-green-300 rounded p-1"
                            onClick={async()=>{
                                await startGame()
                                navigate("/game")
                            }}
                        >
                            StartGame
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
} 
export default WaitingRoom;