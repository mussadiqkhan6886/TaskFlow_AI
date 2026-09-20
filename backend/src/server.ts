import dotenv from "dotenv"
import connectDB from "./config/dbConnection"
import mongoose from "mongoose"
import { connectRedis } from "./config/connectRedis"
import app from "./app"
import {Server} from "socket.io"
import { createServer } from "node:http"
import { socketConfig } from "./socket"

if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: ".env.test", override: true });
} else {
    dotenv.config();
}
const PORT : number = Number(process.env.PORT) || 4000

const httpServer  = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});
connectDB()
connectRedis()
socketConfig(io)
mongoose.connection.once("open", () => {
    console.log("MongoDB connected");
    httpServer.listen(PORT, () : void => console.log(`Server running on port ${PORT}`))
})
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
