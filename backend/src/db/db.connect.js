import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB= async ()=> {
    try {
        // const invalidChars = /[/.\\*"<>:|?]/;
        // if (invalidChars.test(DB_NAME) || DB_NAME.length === 0 || DB_NAME.length > 64) {
        //     throw new Error('Wrong database name.');
        // }

        const connectionString= `${process.env.MONGO_URI}/${DB_NAME}`;
        // console.log(connectionString);

        const connectionInstance = await mongoose.connect(`${connectionString}`);
        console.log("Mongoose Connected at HOST: ", connectionInstance.connection.host);
    } catch (error) {
        console.error("MongoDb Connection Failed", error)
        // process.exit(1);
        throw error;
    }
}
export default connectDB;