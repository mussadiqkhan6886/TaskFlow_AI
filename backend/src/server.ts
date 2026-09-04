import dotenv from "dotenv"
import connectDB from "./config/dbConnection"
import mongoose from "mongoose"
import { connectRedis } from "./config/connectRedis"
import app from "./app"
dotenv.config()
const PORT : number = Number(process.env.PORT) || 4000

connectDB()
connectRedis()

mongoose.connection.once("open", () => {
    console.log("MongoDB connected");
    app.listen(PORT, () : void => console.log(`Server running on port ${PORT}`))
})
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
