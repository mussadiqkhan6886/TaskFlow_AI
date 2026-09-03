import express, {type Express} from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { corsOptions } from "./config/corsOptions"
import connectDB from "./config/dbConnection"
import mongoose from "mongoose"
import { errorHandler } from "./middleware/errorHandler"
import authRouter from "./routes/authRoutes"
import userRouter from "./routes/userRoutes"
import noteRoute from "./routes/noteRoutes"
import { connectRedis } from "./config/connectRedis"

dotenv.config()
const app : Express = express()
const PORT : number = Number(process.env.PORT) || 4000

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
connectDB()
connectRedis()
app.use("/api/auth",authRouter)
app.use("/api/users", userRouter)
app.use("/api/notes", noteRoute)

app.use(errorHandler)

mongoose.connection.once("open", () => {
    console.log("MongoDB connected");
    app.listen(PORT, () : void => console.log(`Server running on port ${PORT}`))
})
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
