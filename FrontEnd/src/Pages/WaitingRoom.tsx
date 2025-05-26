import {useState,useEffect} from "react"
import {useNavigate}  from "react-router-dom"

import {useAppDispatch, useAppSelector } from "../Redux/hooks"
import CircleQuarter from "../Components/CircleQuarter"
import Banner from "../Components/Banner"
import { Dispatch } from "@reduxjs/toolkit"
import { setPlayers } from "../Redux/slices/socketSlice"
import { useSocket } from "../providers/socketProvider"
const WaitingRoom =()=>{
    const roomId = useAppSelector((state)=> state.socketRoom.roomId)
    const players = useAppSelector((state)=> state.socketRoom.players)
    const host = useAppSelector((state)=> state.socketRoom.host)
    const roomSize = useAppSelector((state)=> state.socketRoom.roomSize)

    const [count,setCount] = useState<number>(4)
    const [rotateFlag,setRotateFlag] = useState<boolean>(false)
    
    const socket = useSocket()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    
    const playerSocketId = socket?.id 
    
    const startGame = ():Promise<void>=>{
        return new Promise((resolve)=>{
        socket?.emit('startGame',roomId)
        resolve()
    })
    }
    
    const leaveGame = ()=>{
            socket?.emit('leaveRoom',roomId)
    }

    const bannerPosition = (index:number)=>{
       let arr:any[]=[]
       if(index>2){
         let k = index/2;
         let a = k*4
         for(let i=0;i<index;i++){
            if(i<k){
            arr.push("pt-"+a)
            a=a-4;
            }else{
                a=a+4
                arr.push("pt-"+a)
            }
            console.log(a)
         }
       }  
        return arr
    }

    let arr = bannerPosition(players.length) 
    
    useEffect(()=>{
        socket?.on('playerJoined',(response)=>{
            console.log(response)
            console.log(response.players)
            dispatch(setPlayers(response.players))
        })
        return ()=>{
            socket?.off('playerJoined')
        }
    },[socket,players])

    useEffect(()=>{
        socket?.on('gameStart',()=>{
            setRotateFlag(true)
            const interval = setInterval(()=>{
                setCount((num)=> {
                if(num <0){
                    clearInterval(interval)
                    setRotateFlag(false)
                    socket?.emit('readyForQuestion',roomId)
                    navigate('/game')
                }
                return num-1
                })
            },1000)
            
        })
        return ()=>{
            
            socket?.off('gameStart')
        }
    },[socket,players])
    
    
    return <div className="bg-black h-screen">
        <div className="h-full flex flex-col">
            <div className="flex justify-between px-15 mr-10 items-center">
                <div className="flex justify-start items-center pb-4  font-mono w-[40%] text-6xl font-extrabold text-purple-500  drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]  h-[130px] mt-10 ">
                    Game Lobby
                </div>
                <div className="flex flex-col gap-2 mt-10 justify-end">
                    <div className="text-xl  text-white font-mono tracking-widest  flex items-center justify-center">
                        Host By : {host}
                    </div>
                    <div className="text-xl font-mono text-white flex gap-4">
                        <span>Room Size : </span><span>{roomSize}</span>
                    </div>
                    <div className="text-white text-xl  font-mono  ">
                         No of Players : {players.length}
                    </div>  
                </div>
            </div>
            <div className="border-3 flex flex-col  rounded m-10 ">
                
                <div className="mb-30">
                    <div className="flex justify-evenly">
                        
                        {players && players.map((player,index)=>{
                             
                            return <div className={`pt-5 `}>
                                    <Banner />
                                     <div key={index} className="mt-5 text-white">
                                         {player}                                     
                                      </div>
                                   </div>
                        })}
                    </div>
                </div>
             
                <div className="text-white flex justify-center gap-10  rounded-b h-[70px] relative">
                    <div className="flex font-mono text-lg   justify-center items-center gap-10">
                        <button className="border-2 border-[#303030] hover:bg-white tracking-wide hover:border-white hover:text-purple-500 rounded-lg p-2 hover:cursor-pointer"
                             onClick={()=>{
                                navigate("/")
                                leaveGame()
                             }}
                             >
                            Leave Room
                        </button>
                        <button className="border border-purple-500 hover:text-purple-500 hover:bg-white rounded-lg p-2 bg-purple-500  tracking-wide hover:scale-105 transition-all duration-250 hover:cursor-pointer text-white ">
                            Ready
                        </button>
                        {(host === playerSocketId) &&
                                <button
                                onClick={async()=>{
                                        await startGame()
                                    }} 
                                className="border-2 border-[#303030] rounded-lg p-2 hover:bg-white  hover:bg-white tracking-wide hover:text-purple-500 hover:cursor-pointer">
                                    Start Game
                                </button>
                                
                        }
                    </div>
                    <div className="flex items-center">
                        <CircleQuarter flag={false} rotate={rotateFlag}/>
                    </div>
                </div>
                <div className="flex justify-end mr-3 text-neutral-500 ">
                    *  Only Host could start the game
                </div>
               
            </div>
        </div>
    </div>
} 
export default WaitingRoom;