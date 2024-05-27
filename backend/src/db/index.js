import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB= async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("Mongoose Connected at HOST: ", connectionInstance.connection.host);
    } catch (error) {
        console.error("MongoDb Connection Failed", error)
        // process.exit(1);
        throw error;
    }
}
export default connectDB;