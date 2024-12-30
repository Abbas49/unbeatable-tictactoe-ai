import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const connectDB = async () =>{
    if(mongoose.connections[0].readyState){
        return true;
    }

    try{
        const mongoDB = process.env.mongoDB;
        if (!mongoDB) {
            throw new Error("mongoDB connection string is not defined in environment variables");
        }
        await mongoose.connect(mongoDB);
        console.log("MongoDB connected");
        return true;
    }catch(error){
        console.error(error);
        return false;
    }
}

export default connectDB;