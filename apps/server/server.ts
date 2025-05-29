import mongoose from "mongoose";
import {app} from "./app";
import { redisService } from "./utils/redisClient";
import { environment } from "./config/environment";
import { scheduleSeasonRefresh } from "./utils/updateSeasonData";
import { startupDataLoader } from "./services/startupDataLoader";
import { logger } from "./utils/logger";

mongoose.set("strictQuery", true);

mongoose.connect(environment.DB_HOST)
.then(async ()=>{
    await redisService.connect();
    logger.info(`Database connection successful, Redis connected`);
    
    // Load all data before starting the server
    await startupDataLoader.loadAllData();
    
    // Now start the server
    app.listen(environment.PORT, () => {
        scheduleSeasonRefresh();
        logger.info(`Server running on port ${environment.PORT} - Ready to serve requests!`);
    });
})
.catch((err: any)=>{
    logger.error('Failed to start server:', err.message);
    process.exit(1);
})