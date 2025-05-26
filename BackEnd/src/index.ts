import express from "express";
import userRouter from "./routes/userRoute";
import cors from "cors"

import matchRouter from "./routes/matchRouter";


const app = express();
app.use(cors())
app.use(express.json());


app.use("/api/user", userRouter);
app.use('/api/match', matchRouter);



app.listen(3000, () => console.log("Server running on port 3000"));

