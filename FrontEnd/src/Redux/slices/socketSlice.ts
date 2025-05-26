import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { Socket } from "socket.io-client"

interface SocketState{
    host:string
    roomId :string | null
    players :string[]
    scores : Record<string,number>
    lifelines :Record<string,boolean>
    roomSize :number

}
const initialState:SocketState = {
    host:'',
    roomId:null,
    players:[],
    scores:{},
    lifelines:{},
    roomSize:0,

}
export const socketSlice = createSlice({
    name:"socketRoom",
    initialState,
    reducers:{
        
        setRoomSize:(state,action:PayloadAction<number>)=>{
            state.roomSize = action.payload
        },
        setHost:(state,action:PayloadAction<string>)=>{
            state.host = action.payload
        },
        setRoomId:(state,action:PayloadAction<string>)=>{
            state.roomId = action.payload
        },
        setPlayers:(state,action:PayloadAction<string[]>) =>{
            state.players=action.payload
        },
        setScores:(state,action:PayloadAction<Record<string,number>>)=>{
            state.scores = action.payload
        },
        setLifelines:(state,action:PayloadAction<Record<string,boolean>>)=>{
            state.lifelines = action.payload
        },
    }

})
export const {

    setRoomSize,
    setHost,
    setRoomId,
    setPlayers,
    setLifelines,
    setScores,
    
} = socketSlice.actions

export default socketSlice.reducer