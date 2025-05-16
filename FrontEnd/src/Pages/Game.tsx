import {useState,useEffect, useCallback} from "react"
import { useNavigate } from "react-router-dom"
import {getSocket} from "../socket/socket"
import axios from 'axios'
import {useAppDispatch,useAppSelector} from "../Redux/hooks"
import Timer from "../Components/Timer"
import { current } from "@reduxjs/toolkit"
interface QuestionType{
    question:string
    options:string[]
}
const Game = ()=>{
    const navigate = useNavigate()

    const [round,setRound] = useState<number>(1)
    const [currentQuestionIndex,setCurrentQuestionIndex] = useState<number>(0)
    const [answers,setAnswers] = useState<(number|null)[]>([])
    const [reset,setReset] = useState<number>(0)
    const [selected,setSelected] = useState<number>(-1)
    const roomId = useAppSelector((state)=>(state.socket.roomId))
    const [questions,setQuestions] = useState<QuestionType[]>([])
    const socket = getSocket()
    const [currentQuestion,setCurrentQuestion] = useState<QuestionType>()
    const [powerUps,setPowerUps] = useState<string[]>([])
    const [targetId,setTargetId] = useState<string[]>([])
    const [showPlayers,setShowPlayers] = useState<boolean>(false)
    const [freeze,setFreeze] = useState<boolean>(false)
    
    //axiosStart
    const scoreReq = async (roomScores:any)=>{
        try{
        const response = await axios.post('http://localhost:3000/match',(roomScores))
            if(response.status == 200){
                console.log(response.data)
            }else{
                console.log("leaderboard is not created and match too")
            }
        }catch(error){
            console.log(error)
        }
    }
    
    
    const getTargetIds = ()=>{
        socket.emit('targetId',roomId)
    }
    const submission = useCallback(()=>{
        if(round==1){
            socket.emit('submitAnswer',{roomId,answers:answers})
            newQuestion('Round2')
        }else if(round ==2){
            socket.emit('submitAnswer',{roomId,answer:selected})
          
            newQuestion('Round2')
        }else if(round == 3){
            socket.emit('submitAnswer3',{roomId,answer:selected})
            newQuestion('Round3')
            console.log("timeUpsir")
        }
    },[round,roomId,answers,selected,socket])
    const newQuestion = (round:string)=>{
        socket.emit(`${round}`,roomId)
    }
    if(round==2){
        socket.emit('powerUps')
    }
    console.log("powerUps is:", powerUps, "Type:", typeof powerUps);
    const handlePower = (powerUp:string,targetId:string)=>{
        setPowerUps((prev)=>prev.filter(p => p !== powerUp))
        socket.emit('powerUpActivated',roomId,powerUp,targetId)
    }
    
    const handleTimeUp = useCallback(()=>{
        socket.emit('submitAnswer',{roomId,answer:selected})
    },[selected,roomId])
    console.log(round)
    useEffect(()=>{
        socket.on('targets',(response)=>{
            console.log(response)
            setTargetId(response)
        })
    })
    useEffect(()=>{
        const handleNewQuestion = ({question,options}:{question:string,options:string[]})=>{
            setCurrentQuestion({question,options})
            console.log(question+"this is the ques")
        }

        if(round ==1 ){
            socket.on('questions',(response)=>{
                if(response){
                    setQuestions(response)
                }else{
                    console.log("failed big time dude")
                }
            })
        }else if(round==2){
            socket.on('Round2End',(response)=>{
                console.log(response)
                if(response){
                    setRound((prev)=>prev+1)
                    socket.emit('Round3',roomId)
                }else{
                    console.log("Got Round 2 end but response has shit ")
                }
            })
                socket.on('powerUpReceived',(response)=>{
                  if(response == 'freezeOpponent'){
                    setFreeze((prev)=> !prev)
                    console.log("freezed bruh")
                  }  
                })
                socket.on('powerUps',(response)=>{
                    if(response){
                        setPowerUps(response)
                        console.log(response)
                    }else{
                        console.log("powerUps got shit")
                    }
                })
                socket.on('QuestionsR2',handleNewQuestion)
                console.log(currentQuestion)
                console.log("Round2")
           
        }else if(round ==3){
            socket.on('Round3End',(response)=>{
                
                if(response){
                    
                    const roomScores = {player1:20,player2:30}
                    console.log(roomScores)
                    scoreReq(roomScores)
                    navigate('/leaderBoard',{state:roomScores}) 
                }
            })
            socket.on('QuestionsR3',handleNewQuestion)
        }
        return ()=>{
            socket.off('Round2End')
            socket.off('Round3End')
            socket.off('QuestionsR3',handleNewQuestion)
            socket.off('QuestionsR2',handleNewQuestion)
            }
    },[round])
    
    console.log(round)
    return <div className="bg-[#8e70f7] px-30 py-20 h-screen font-[Roboto]">
        <div className="bg-white flex items-center p-1 flex-col rounded-xl h-full justify-center">
            <div className=" px-40 py-5 w-full rounded-full ">
                <div className="p-2 flex h-[100px] justify-between">   
                        <div className="text-xl font-extrabold">
                            Round-{round}
                        </div>
                        {round == 2 && 
                        <div className="flex flex-col">
                           { showPlayers && <div className="flex gap-2 p-1">
                            <div className="bg-red-200 rounded" onClick={()=>{
                                setShowPlayers((prev)=> !prev)
                            }}> 
                                ❌
                            </div>
                            {targetId && targetId.map((player,index)=>
                             (<div className="hover:bg-gray-200 rounded-full text-[10px] flex justify-center items-center px-1 font-bold text-amber-600 hover:cursor-pointer" key={index} onClick ={()=>{
                                handlePower('freezeOpponent',targetId[index])
                                setShowPlayers((prev)=> !prev)
                             }}>
                                P{index}
                             </div>)   
                            )}
                            </div>}
                            <div className="flex gap-4 text-xl">

                                <div className={`flex items-center  hover:bg-amber-100 hover:rounded-full hover:bg-opacity-150 ${powerUps.includes("doublePoints")? "opacity-100 cursor-pointer" :"opacity-50"}`}
                                    onClick={powerUps.includes("doublePoints")? ()=>{
                                        handlePower("hint",'')
                                        
                                    }:undefined}>
                                    🪙
                                </div>
                                <div className={`flex items-center  hover:bg-amber-100 hover:rounded-full hover:bg-opacity-150 ${powerUps.includes("hint")? "opacity-100 cursor-pointer" :"opacity-50"}`}
                                    onClick={powerUps.includes("hint")? ()=>{
                                        handlePower("hint",'')
                                    }:undefined}>
                                    💡 
                                </div>
                                <div className={`flex items-center  hover:bg-amber-100 hover:rounded-full hover:bg-opacity-150 ${powerUps.includes("extraTime")? "opacity-100 cursor-pointer" :"opacity-50"}`}
                                    onClick={powerUps.includes("extraTime")? ()=>{
                                        handlePower("extraTime",'')
                                    }:undefined}>
                                    ⏳
                                </div>
                                <div className={`flex items-center  hover:bg-amber-100 hover:rounded-full hover:bg-opacity-150 ${powerUps.includes("freezeOpponent")? "opacity-100 cursor-pointer" :"opacity-50"}`}
                                    onClick={powerUps.includes("freezeOpponent")? ()=>{
                                        getTargetIds()
                                        setShowPlayers((prev)=> !prev)
                                    }:undefined}> 
                                    ❄️ 
                                </div>
                            </div>
                        </div>
                        }   
                        <div>
                             <Timer timeUp={submission} socket={socket} round={round} />
                        </div>
                </div>
                <div className=" flex justify-center">
                    <div className="p-10  w-[50%]  max-h-[500px] bg-[#fcfbff] rounded-xl flex flex-col shadow-md">
                        <div className="mb-10 p-4 min-h-[100px]  shadow-neutral-300 shadow-md rounded-xl">
                            <div className="text-[#7B61FF] mb-2 text-xl font-[Open_Sans] font-medium">
                                Question - {currentQuestionIndex+1}
                            </div>
                            <div className="text-[19px]">
                              {round ===1? (questions.length>0? questions[currentQuestionIndex].question : "Loading Question") 
                              : round !==1 ? (currentQuestion? currentQuestion.question : "Loading Question") : ""}
                            </div>
                        </div>
                        <div className="text-[20] ">
                            { (round == 1? (questions.length>0? questions[currentQuestionIndex]?.options:[])
                            :(round != 1 && !freeze ?currentQuestion?.options : []))?.map((option:string,index:number)=>(
                                <div key={index} className={`pr-5 p-1 flex justify-between ${selected===index?" bg-white h-[42px] rounded-r-xl shadow-xl":"border-1 rounded border-gray-300"} mt-5`} 
                                onClick={()=>{
                                    if(round ==1 ){
                                       setSelected(index)
                                       setAnswers((prev) => {
                                           const updated = [...prev];
                                           updated[currentQuestionIndex] = index;
                                           return updated;
                                       });
                                    }else if(round !=1){
                                        setSelected(index)
                                    }
                                }}>
                                        <div className="flex justify-center">
                                            <div className={`w-1 h-full flex mr-6 ${selected===index?"bg-[#8e70f7]":"bg-transparent"}`}></div>
                                            <div className="flex items-center ">{option}</div>
                                        </div>
                                        <input type="radio" className="form-radio accent-[#8e70f7] bg-transparent" checked={selected === index } />
                                </div>
                                
                            )) 
                            }
                        </div>
                        
                    </div>
                    
                </div>
                
                <div className="flex justify-center gap-10 mt-10">  
                    { round === 1?(
                    <>
                        <div className="roundedd-lg p-2 bg-teal-200 cursor-pointer" onClick={()=>{
                            if(currentQuestionIndex>0){
                                setCurrentQuestionIndex((prev)=> prev-1)
                                const prevSelected = answers[currentQuestionIndex-1]
                                setSelected(prevSelected!=null?prevSelected:-1)
                            }
                            }}>
                                Back
                            </div>
                        {currentQuestionIndex!= questions.length-1?
                        (<div className="roundedd-lg p-2 bg-teal-200 cursor-pointer" onClick={()=>{
                            if(currentQuestionIndex<questions.length-1){
                                setCurrentQuestionIndex((prev)=> prev+1)
                                const nextSelected = answers[currentQuestionIndex+1]
                                setSelected(nextSelected != null ? nextSelected:-1)
                            }
                        }}>
                            Next
                        </div>):(
                        <div  className="rounded-lg p-2 bg-teal-200 cursor-pointer" onClick={()=>{
                            submission()
                            setSelected(-1)
                            console.log('Round'+round+'akjnjwdkjawn')
                            setRound((prev)=>{
                                return prev+1
                            })
                         
                        }}>
                            Submit Answer
                        </div>)}
                    </>) 
                        :(
                        <div className="bg-teal-200 rounded" 
                        onClick={()=>{
                            
                            submission()
                            setSelected(-1)
                        }}>
                            SubmitAnswer
                        </div>  
                        ) }
                </div>
            </div>
        </div>
    </div>
}
export default Game