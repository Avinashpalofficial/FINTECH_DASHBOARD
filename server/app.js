import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import { authRouter } from "./routes/authRoutes.js"
import { errorMiddleware } from "./middleware/error.js"
import cookieParser from 'cookie-parser'
dotenv.config()
connectDB()
const app = express()
const PORT =  process.env.PORT
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/auth',authRouter)
app.use(errorMiddleware)
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    
})
