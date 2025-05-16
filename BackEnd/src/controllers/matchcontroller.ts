import { Request, Response } from "express";

export  const  createMatch = async (req: Request, res: Response):Promise<void> => {
  try {
    console.log("came here")
    res.status(200).json({message:"Created the match",data:{player1:20,player2:30}});
  } catch (error) {
    res.status(500).json({message:"Didn't create the match"});
  }
}
