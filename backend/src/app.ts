import express, {type Express} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { corsOptions } from "./config/corsOptions"
import { errorHandler } from "./middleware/errorHandler"
import authRouter from "./routes/authRoutes"
import userRouter from "./routes/userRoutes"
import noteRoute from "./routes/noteRoutes"

const app : Express = express()

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/users", userRouter)
app.use("/api/notes", noteRoute)

app.use(errorHandler)
export default app