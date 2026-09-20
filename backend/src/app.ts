import express, {type Express} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { corsOptions } from "./config/corsOptions"
import { errorHandler } from "./middleware/errorHandler"
import authRouter from "./routes/authRoutes"
import userRouter from "./routes/userRoutes"
import noteRoute from "./routes/noteRoutes"
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import aiRoute from "./routes/aiRoutes"
import messageRouter ./routes/messageRouteseRoutes"

const app : Express = express()

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.get("/health", (req, res) => {
    res.status(200).send("OK")
})
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
app.use("/api/auth",authRouter)
app.use("/api/users", userRouter)
app.use("/api/notes", noteRoute)
app.use("/api/ai", aiRoute)
app.use("/api/messages", messageRouter)
app.use(errorHandler)
export default app