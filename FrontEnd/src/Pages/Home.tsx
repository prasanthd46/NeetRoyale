import React,{useState,useEffect, ChangeEventHandler, ChangeEvent, useCallback} from "react"
import {io} from "socket.io-client"
import {useNavigate} from "react-router-dom"
import { useAppDispatch } from "../Redux/hooks"
import { setRoomId } from "../Redux/slices/socketSlice"
import { getSocket } from "../socket/socket"
interface roomDetails{
    size: number,
    roomId: string
}
const socket = getSocket()
const Home = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [isHost,setHost] = useState(false);
    const [players,setPlayers] = useState<string[]>([]);
    const [roomDetails,setRoomDetails] = useState<roomDetails>({size:0,roomId:''});
    let  a:string ='1';
    const createRoom = useCallback((size: number ):Promise<void> => {
        return new Promise((resolve)=>{
        socket.emit('createRoom', size, (response: any) => {

            setRoomDetails({ size: size, roomId: response.roomId })
            setHost(true)
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
                if(response.status == "ok"){
                    setRoomDetails({
                        size : response.maxplayers,
                        roomId:response.roomId
                    });
                    console.log(`Player Joined room : ${roomId}`)
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
        socket.on('playerJoined',(playersInRoom:string[])=>{
            setPlayers(playersInRoom)
            console.log("players in the room :",playersInRoom)
        })
        return ()=>{
            socket.off('playerJoined');
        }
    },[])
    return <>
        <div className="bg-black h-screen w-full">
            <div className="flex justify-center h-full">
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
