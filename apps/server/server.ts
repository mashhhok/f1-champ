import mongoose from "mongoose";
import {app} from "./app";
import { redisClient } from "./utils/redisClient";
import { DB_HOST, PORT } from "./config/environment";
import { scheduleSeasonRefresh } from "./utils/updateSeasonData";
import { startupDataLoader } from "./services/startupDataLoader";

mongoose.set("strictQuery", true);

mongoose.connect(DB_HOST)
.then(async ()=>{
    await redisClient.connect();
    console.log(`Database connection successful, Redis connected`);
    
    // Load all data before starting the server
    await startupDataLoader.loadAllData();
    
    // Now start the server
    app.listen(PORT);
    scheduleSeasonRefresh();
    console.log(`Server running on port ${PORT} - Ready to serve requests!`);
})
.catch((err: any)=>{
    console.log(err.message);
    process.exit(1);
})