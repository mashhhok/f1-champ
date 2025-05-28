import mongoose from "mongoose";
import {app} from "./app";
import { redisClient } from "./utils/redisClient";
import { DB_HOST, PORT } from "./config/environment";

mongoose.set("strictQuery", true);

mongoose.connect(DB_HOST)
.then(async ()=>{
    app.listen(PORT);
    await redisClient.connect();
    console.log(`Database connection successful, server running on port ${PORT}`);
})
.catch((err: any)=>{
    console.log(err.message);
    process.exit(1);
})