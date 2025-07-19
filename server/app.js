import dotenv from "dotenv"
dotenv.config()

import express from "express" 
import cors from "cors"
import { connectToDb } from "./db/db.js"
import cookieParser from "cookie-parser"
import userRoutes from './routes/user.routes.js'
import toolRoutes from './routes/tools.routes.js'

const app = express()

connectToDb()

const allowedOrigins = ['http://localhost:5173']

app.use(express.json())
app.use(cors({
    origin : allowedOrigins,
    credentials : true
}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/users', userRoutes);
app.use('/tools', toolRoutes)

export {app}