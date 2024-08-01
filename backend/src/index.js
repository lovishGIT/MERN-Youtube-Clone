import "dotenv/config";
import connectDB from "./db/db.connect.js";
import { app } from "./app.js";

connectDB()
.then(() => {
    app.listen(process.env.PORT, ()=> {
        console.log(`Server Running at Port: `, process.env.PORT);
    })
})
.catch((err) => {
    console.error("MongoDb Connection Failed", err);
})


app.get('/', (req, res)=> {
    res.send('Hello!!');
})// temp











/*
import express from "express";
const app= express();

;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error",(error)=> {
            console.error("Connection App Error: ",error);
            throw error;
        })
        app.listen(process.env.PORT, ()=> {
            console.log("Database Connected.\nServer running at PORT: ", process.env.PORT);
        })
    }
    catch(error) {
        console.error("Connection Error: ", error);
        throw error;
    }
})();
CONNECTIONS ARE HANDLED IN DB FOLDER.
*/