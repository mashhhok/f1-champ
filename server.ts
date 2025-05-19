import mongoose from "mongoose";
import {app} from "./app";
import dotenv from "dotenv";

dotenv.config();

const DB_HOST = process.env.DB_HOST as string || "mongodb+srv://ryabikovamari003:KZWkJVYYWtar0ifT@f1.yimt6qw.mongodb.net/";
const PORT = Number(process.env.PORT) || 4000;

mongoose.set("strictQuery", true);

mongoose.connect(DB_HOST as string)
.then(()=>{
    app.listen(PORT);
    console.log(`Database connection successful, server running on port ${PORT}`);
})
.catch((err: any)=>{
    console.log(err.message);
    process.exit(1);
})