import React,{useState,useEffect, ChangeEventHandler, ChangeEvent, useCallback} from "react"
import {io} from "socket.io-client"
import {useNavigate} from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../Redux/hooks"
import { setHost, setPlayers, setRoomId } from "../Redux/slices/socketSlice"
import { getSocket } from "../socket/socket"
import Navbar from "../Components/Navbar"
interface roomDetails{
    size: number,
    roomId: string
}
const socket = getSocket()
const Home = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    
    const players=useAppSelector((state)=>state.socket.players)
    const [roomDetails,setRoomDetails] = useState<roomDetails>({size:0,roomId:''});
    
    const createRoom = useCallback((size: number ):Promise<void> => {
        return new Promise((resolve)=>{
        socket.emit('createRoom', size, (response: any) => {
            console.log(response)
            dispatch(setHost(response.host))
            setRoomDetails({ size: size, roomId: response.roomId })
            resolve()
        })  })
    },[])
    console.log(roomDetails)
    console.log("outside")
    useEffect(()=>{
    console.log(roomDetails.roomId+"wdakmd")
    dispatch(setRoomId(roomDetails.roomId))
    
    console.log(roomDetails)
},[roomDetails.roomId])

        const joinRoom = useCallback((roomId:string) :Promise<{status:string,message:string}>  => {
            return new Promise((resolve)=>{
            socket.emit('joinRoom',roomId,(response:any)=>{
                console.log(response)
                if(response.status == "ok"){
                    console.log(response)
                    setRoomDetails({
                        size : response.maxplayers,
                        roomId:response.roomId
                    });
                    dispatch(setHost(response.host))
                    resolve({status:"ok",message:""})
                }else{
                    if(response.status =="error"){
                        resolve({status:"error",message:"room does not exits or is full"})
                    }
                }
            })
        })
        },[])
        useEffect(()=>{
            socket.on('playerJoined',(response:{players:string[],host:string})=>{
                console.log(response.players)
                console.log("gg pubg")
                dispatch(setPlayers(response.players))
                console.log("anda anda anda")
           
        })
        return ()=>{
            socket.off('playerJoined');
        }
    },[players])
    return <>
        <div className="bg-black h-[120vh] max-w-screen  ">
            <Navbar />
            <div className="h-screen  bg-white ">
                <div className="bg-black flex justify-center w-full h-full"> 
                    <div className="flex flex-col justify-center items-center  bg-black text-white h-full w-[50%] p-10">
                        <div className="text-[110px] font-mono h-[40%px] flex items-center font-extrabold">
                                
                                neetRoyale 
                        </div>
                        <div className="h-[70px] text-2xl italic text-gray-500 font-bold">
                               ~ Not Just a Test. It's a Royale.
                        </div>
                        <div className="h-[30%]  flex items-center">
                            <div className="rounded-full p-2 font-bold text-2xl ring-2 hover:ring-purple-500 hover:scale-102 transition-all duration-400 ring-white/20 w-[100px] flex justify-center  hover:text-purple-400 items-center cursor-pointer">
                                Play
                            </div>
                        </div>  
                        
                        
                    </div>
                    <div className="h-[93%] w-[50%] p-10">
                        <div className="text-white ring-1 p-10  ring-white/10 rounded-4xl bg-white/3 h-full ">
                            <div className="flex flex-col items-center h-full w-full justify-start mt-20 ">
                                <div className="font-semibold text-lg tracking-widest">
                                What is NeetRoyale <span className="text-xl text-purple-500">?</span>
                                </div>
                                <div className="mt-10 font-semibold tracking-wider px-10 ">
                                     NeetRoyale is not your regular NEET quiz. It's a fast-paced, real-time battle where
                                         you compete against your friends to answer NEET-level questions live.
                                </div>
                                <div className="mt-10 font-semibold tracking-wider px-10">
                                     On Exam Day , There will be two things that matters - one is preparation that you did and 
                                     another one - the state of your mind.
                                      The preparation is in your hands. But the State of mind could be improved using this
                                     fast paced game to stable your mind in situations of tackling difficuly questions.
                                </div>
                                <div className="mt-10 font-semibold tracking-wider px-10 pb-10">
                                    This Game is designed in a way to keep the POV of person who is playing , to improve 
                                    handling their situation in tackling hard questions . It practices your mind 
                                    to have a better state.                                      
                                </div>
                                <div className="italic text-white/20 mt-10 font-semibold tracking-wider px-10 pb-5">
                                        Survive. Compete. Conquer NEET
                                </div>
                                <div className="italic text-white/20 font-semibold tracking-wider px-10">

                                </div>
                                <div className="mt-10 italic font-semibold tracking-wider px-10 pb-10">
                                     Dude , Dont stress out ~ Just Play and Chill  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" bg-black h-screen flex justify-center h-full text-white ">
                <div className="flex flex-col justify-center items-center">
                    <div className="text-white flex mb-20 h-20">
                        <button  onClick={async ()=> {
                            if(roomDetails.size>4){
                                alert("size should not be greater than 4")
                            }else{
                                await createRoom(roomDetails.size)
                                navigate(`/waitingroom`)
                            }   
                            }
                        } className="bg-white h-10 mt-10  mr-10 font-medium cursor-pointer rounded-full text-black px-7 py-2 ">
                            Create Room
                        </button>
                        <div className="mt-3 flex flex-col items-center h-30">
                            <div className="mt-4 mb-2 font-semibold">Choose Player Size:</div>
                            <input type="number" onChange={(e)=>{
                                const roomSize = parseInt(e.target.value,10) 
                                setRoomDetails({size:roomSize,roomId:''})
                            }}

                            className="bg-white rounded-full h-7 text-black w-20 "  />
                        </div>
                    </div>
                    <div className="flex items-center text-white ">
                        <input onChange={(e)=>{
                            const id = e.target.value;
                            setRoomDetails((prevDetails)=>({...prevDetails,roomId:id}))
                            
                            
                          }
                        }className="bg-white rounded-full h-6 text-black" />
                        <button onClick={()=>{
                            joinRoom(roomDetails.roomId).then((result)=>{
                                if(result.status == "error"){
                                    alert(result.message);
                                }else if(players){
                                    navigate("/waitingroom")
                                }
                            })
                        }}
                        className="ml-8 border-2  rounded-full px-5 py-1 font-semibold cursor-pointer">Join Room</button>
                    </div>
                </div>
            </div>

        </div>
    </>
}
export default Home;
