import express from "express";
import cors from "cors";
import { driversRouter } from "./routes/drivers";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", driversRouter);


app.use((_: any , res: any)=>{
    res.status(404).json({
        message: "Not Found"
    })
})

app.use((err: any, _: any, res: any, __: any) => {
    const {status = 500, message = "Server Error"} = err;
    res.status(status).json({message})
})