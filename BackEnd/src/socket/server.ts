import express from "express"
import {Server} from "socket.io"
import http from "http"
import cors from "cors"
import { convertToObject } from "typescript";

const app = express();
const server = http.createServer(app);
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
});
type powerUpType = 'doublePoints' | 'extraTime' | 'hint' | "freezeOpponent"
type playerPowerUps ={
    [key in powerUpType]? : {Available:boolean,Usage:boolean}
}
type playerTimer = {
    timeLeft : number,
    interval : ReturnType<typeof setInterval>
}
type room = {
    
    players : string[],
    scores :Record<string,number>,
    lifelines: Record<string,boolean>,
    maxplayers:number,
    currentQuestions:string[],
    powerups : Record<string,playerPowerUps>,
    playerTimes:Record<string,playerTimer>,
    round:number
    
}
const rooms : Record<string,room> = {}

const questions = [
    {
      question: 'What is 2+2?',
      options: ['3', '4', '5', '6'], 
      answer: 2,
    },
    {
      question: 'Capital of France?',
      options: ['Berlin', 'Paris', 'London', 'Rome'],
      answer: 2,
    },
    {
      question: 'Who wrote Hamlet? Who wrote Hamlet? Who wrote Hamlet? Who wrote Hamlet? Who wrote Hamlet? ',
      options: ['Marlowe', 'Shakespeare', 'Dickens', 'Austen'],
      answer: 2,
    }
]
const currentQuestionsServer= [{
    question: 'What is 2+2?',
    options: ['3', '4', '5', '6'],
    answer: 2,
  },
  {
    question: 'Capital of France?',
    options: ['Berlin', 'Paris', 'London', 'Rome'],
    answer:2,
  },
  {
    question: 'Who wrote Hamlet? Who wrote Hamlet? Who wrote Hamlet? Who wrote Hamlet? Who wrote Hamlet? ',
    options: ['Marlowe', 'Shakespeare', 'Dickens', 'Austen'],
    answer: 2,
  }]

const getNewQuestion = () =>{
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
    return randomQuestion
}

io.on('connection',(socket)=>{
   
    console.log("connection connected",socket.id)
    let doublePoints = false;
    socket.on('createRoom',(maxPlayers:number,callback)=>{
        const roomId = Math.random().toString(36).substring(2,8)
        console.log(roomId)
        if(rooms[roomId]){
             callback({status:'error',message:'Room already exists',rid:roomId})
        }else{
            rooms[roomId] = {
                players:[socket.id],
                scores:{[socket.id]:0},
                lifelines:{[socket.id]:true},
                maxplayers: maxPlayers,
                currentQuestions:[],
                powerups:{
                    [socket.id]:{
                        doublePoints: {Available:false,Usage:false},
                        extraTime: {Available:false,Usage:false},
                        hint: {Available:false,Usage:false},
                        freezeOpponent: {Available:false,Usage:false}
                    }
                },
                playerTimes:{},
                round: 1,
                
            }
        }
        console.log(roomId+"create room room id")
        socket.join(roomId)
        callback({status:'ok',roomId})
        io.to(roomId).emit('playerJoined',rooms[roomId].players)
    })
        socket.on('joinRoom',(roomId:string,callback)=>{
            const room  = rooms[roomId]
          
            if(!room){
                callback({status:'Room is not created'})
                return
            }
            if(room.players.length < room.maxplayers){
                
                rooms[roomId].players = [...rooms[roomId].players,socket.id]
                room.scores[socket.id]=0
                room.lifelines[socket.id] =true
                room.powerups[socket.id]={
                    doublePoints: {Available:false,Usage:false},
                    extraTime: {Available:false,Usage:false},
                    hint: {Available:false,Usage:false},
                    freezeOpponent: {Available:false,Usage:false}
                }
                socket.join(roomId)
                io.to(roomId).emit('playerJoined',room.players)
                callback({status:"ok",roomId,maxplayers:room.maxplayers})
            }else{
                callback({status:"error",message:"room full or does not exist"})
            }
        })
  
    socket.on('startGame',(roomId)=>{
        const room = rooms[roomId]
        console.log(room)
        if(room){
            if(room.round == 1 ){
                const newQues = questions.map((ques)=> {
                    return {
                     question:ques.question,
                     options:ques.options
                    }
                })
                io.to(roomId).emit('questions',newQues)
                console.log(newQues)
        }
           
        }
    })
    let index1 =0
    socket.on('Round2',(roomId)=>{
        const room = rooms[roomId]
        console.log("req2 came")
        console.log(roomId)
        if(room){
            if(room.playerTimes[socket.id]?.interval){
                clearInterval(room.playerTimes[socket.id].interval)
            }
            if(index1>2){
                io.to(socket.id).emit('Round2End','End')
                index1=0;
                room.round++;
            }else{
                const newQues = questions[index1]
                io.to(socket.id).emit('QuestionsR2',{
                    question:newQues.question,
                    options:newQues.options,
                })
                index1++;
                room.playerTimes[socket.id] = {
                   timeLeft:30,
                   interval : setInterval(()=>{
                   const player = room.playerTimes[socket.id]
                   if(!player)return
                   io.to(socket.id).emit('timerTick',player.timeLeft)
                   console.log(player.timeLeft)
                   player.timeLeft--
                   if(player.timeLeft<0){
                       clearInterval(room.playerTimes[socket.id].interval);
                       return 
                   }
               },1000)
        }
        }
        console.log(room.round)
    }
    })

    let index2=0
    socket.on('Round3',(roomId)=>{
        const room = rooms[roomId]
        if(room){
            if(index2>2){
                io.to(socket.id).emit('Round3End',room.scores)
                index2=0;
            }else{
                const newQues = questions[index2]
                io.to(socket.id).emit('QuestionsR3',{
                    question:newQues.question,
                    options:newQues.options,
                })
                if(room.playerTimes[socket.id]?.interval){
                    clearInterval(room.playerTimes[socket.id].interval)
                }
                index2++;
                room.playerTimes[socket.id] = {
                   timeLeft:24,
                   interval : setInterval(()=>{
                   const player = room.playerTimes[socket.id]
                   if(!player)return
                 
                   io.to(socket.id).emit('timerTick',player.timeLeft)
                   player.timeLeft--
                   if(player.timeLeft<0){
                       clearInterval(room.playerTimes[socket.id].interval);
                       return 
                   }
               },1000)
        }
        }
    }
    })
    socket.on('targetId',(roomId)=>{
        const room = rooms[roomId]
        socket.emit('targets',room.players)
    })

    socket.on('submitAnswer',({roomId,answer,answers}:{roomId:string,answer:number,answers:number[]})=>{
        console.log("sbumit came")
        const room = rooms[roomId]
        if(room.round == 1){
            let streak =0;
            let powers:string[]= []
            for(let i =0 ;i<questions.length;i++){
                if(questions[i].answer === answers[i]+1){
                    streak ++;
                    if(streak == 2){
                        const powerUps:(keyof playerPowerUps)[] = ['doublePoints' ,'extraTime',  'hint',  "freezeOpponent"]
                        let type:keyof playerPowerUps= powerUps[Math.floor(Math.random() * powerUps.length)]
                        powers.push(type)
                        powers.push('freezeOpponent')
                        room.powerups[socket.id][type]={Available:true,Usage:false}
                        streak=0;
                        console.log(room.powerups[socket.id]['freezeOpponent'])
                    }
                    room.scores[socket.id]+=10
                }else{
                    streak =0;
                }
            }
            console.log(room)
            console.log('submit answer thala')
            io.to(socket.id).emit('powerUps',powers)
            room.round++;
        }else{
            if(room.playerTimes && room.playerTimes[socket.id]){
                clearInterval(room.playerTimes[socket.id].interval)
                delete  room.playerTimes[socket.id]
            }
            if(answer+1 === questions[0].answer){
               const doublePoints:{Available:boolean,Usage:boolean} | undefined= room.powerups?.[socket.id]?.doublePoints
               if(doublePoints && doublePoints.Usage==true){
                   room.scores[socket.id]+=20
                   doublePoints.Available=false
                   doublePoints.Usage=false
               }else{
                   console.log("hi in round2 answer validation")
                   room.scores[socket.id]+=10
               }
            }  
        }
        console.log(room.scores[socket.id])
    })
    socket.on('submitAnswer3',({roomId,answer}:{roomId:string,answer:number})=>{
        const room = rooms[roomId]
        const playerTime = room.playerTimes[socket.id]
        if(room){
            if(answer+1 === questions[0].answer){
                if(playerTime.timeLeft >15 ){
                    room.scores[socket.id]+=3
                }else if(playerTime.timeLeft>=12 && playerTime.timeLeft<=15) {
                    room.scores[socket.id]+=6
                }
                room.scores[socket.id]+=10
            }
        }
        console.log(room.scores[socket.id])
    })
        

        
    
    // socket.on('powerUp',(roomId:string,powerUpType:powerUpType)=>{
    //     const room = rooms[roomId]
    //     const playerPowerUps = room.powerups[socket.id][powerUpType]
    //     if(playerPowerUps){
    //         console.log("yh using powerUp"+powerUpType)
        
    //     switch(powerUpType){
    //         case "doublePoints":
    //             playerPowerUps.Usage = true;
    //             break;
    //         case "extraTime":
    //             playerPowerUps.Usage  = true;
    //             break;
    //         case "freezeOpponent":
    //             playerPowerUps.Usage  = true;
    //             break;
    //         case "hint":
    //             playerPowerUps.Usage  = true;
    //             break;
    //         default :
    //             socket.emit('powerUp',{reason:'Invalid didnt get powerUps usage'})
    //             console.log("sorry bro i didnt get powerUps")
            
    //     }
    // } 
    // })
    socket.on('powerUpActivated',(roomId:string,powerUpType:powerUpType,targetId:string)=>{
        const room = rooms[roomId]
        console.log(roomId)
        console.log(room)
        console.log('here boyyyyajasbhdajhlsb')
        console.log(room.powerups)
        const playerPowerUps= room.powerups[socket.id][powerUpType]
        
        const player = room.playerTimes[socket.id]
        let target:playerTimer
        if(targetId){
            target=room.playerTimes[socket.id]
        }
        if(playerPowerUps){
            switch(powerUpType){
                case "doublePoints":
                    playerPowerUps.Usage= true;
                    break;
                case "extraTime":
                    io.to(socket.id).emit('powerUpReceived',"PowerUp Extra Time Activated (+5sec)")
                    if(player){
                        player.timeLeft += 5
                    }
                    playerPowerUps.Available= false;
                    break;
                case "freezeOpponent":
                    playerPowerUps.Available= false;
                    if(targetId){
                        io.to(targetId).emit('powerUpReceived',powerUpType)
                    }
                    break;
                case "hint":
                    playerPowerUps.Available= false;
                    io.to(socket.id).emit('powerUpReceived',{hint:"hi namaste bye"})
                    break;
                default :
                    socket.emit('powerUp',{reason:'Invalid didnt get powerUps usage'})
                    console.log("sorry bro i didnt get powerUps")
                
            }
        }
    })
    
    
    socket.on('disconnect',()=>{
        for(const roomId in rooms){
            const room = rooms[roomId]
        
        if(room.players.includes(socket.id)){
            room.players = room.players.filter((player) => player!=socket.id)
            delete room.scores[socket.id]
            delete room.lifelines[socket.id]
            io.to(roomId).emit('playerJoined',room.players)
        }
            if(room.players.length===0){
                delete rooms[roomId]
            }
    }
        console.log("player disconnected")
    })
})

server.listen(3001,()=>{
    console.log('server is running on port 3001')
})




