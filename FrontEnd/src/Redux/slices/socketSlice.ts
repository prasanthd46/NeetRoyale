import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface SocketState{
    roomId :string | null
    players :string[]
    scores : Record<string,number>
    lifelines :Record<string,boolean>
    currentQuestion :string | null
}
const initialState:SocketState = {
    roomId:null,
    players:[],
    scores:{},
    lifelines:{},
    currentQuestion:null,
}
export const socketSlice = createSlice({
    name:"socket",
    initialState,
    reducers:{
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
    setRoomId,
    setPlayers,
    setLifelines,
    setScores,
    
} = socketSlice.actions

export default socketSlice.reducer