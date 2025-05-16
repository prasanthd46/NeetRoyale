import express from "express";
import matchRouter from "./routes/match";
import cors from "cors"



const app = express();
app.use(cors())
app.use(express.json());
app.use("/match", matchRouter); // Mount the match router at '/matches'
app.listen(3000, () => console.log("Server running on port 3000"));
