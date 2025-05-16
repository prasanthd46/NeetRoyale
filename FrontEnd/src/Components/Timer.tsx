import {useState,useEffect} from "react"

const Timer = ({socket,round,timeUp}:{socket:any,round:number,timeUp:()=>void})=>{
    
    const [timer,setTimer] = useState<number>(600)
    useEffect(()=>{
        if(round == 2 || round == 3 ){
        const handleTick = (time:number)=>{
            if(time < 1){
                timeUp()
            }else{
                setTimer(time)
            }
        }
        socket.on('timerTick',handleTick)
        return ()=>{
            socket.off('timerTick',handleTick)
        }
    }},[round,timeUp])
    
    useEffect(()=>{
        if(round===1){
        if(timer>0){
            const timeInterval = setTimeout(()=>{
                setTimer((prev)=> (prev-1))
            },1000)
            return () => clearTimeout(timeInterval)
        }else{
            timeUp()
        }
        
    }
    
    },[timer,round,timeUp])
    const mins = Math.floor(timer/60)
    const seconds = timer%60
    return <div>
        {round !=1? (
        <div className="">
            Time Left : {timer}
        </div>):
        (<div className="">
            Time Left : {mins}:{seconds<10?`0${seconds}`:seconds} 
        </div>)}
    </div>
}
export default Timer