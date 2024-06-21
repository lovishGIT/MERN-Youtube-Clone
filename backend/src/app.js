import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app= express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
})); //cors

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb",
}));

app.use(express.static("public"));
app.use(cookieParser()); 

// Routers

import userRouter from "./routes/user.route.js";
import subsRouter from "./routes/subscription.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/subscription", subsRouter);

// app.post("/api/v1/user/register", (req, res)=> {
//     console.log(req.body);
// });


export {app};