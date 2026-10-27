import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { connectRedis, redis } from "../src/config/connectRedis"


let mongoServer: MongoMemoryServer | null = null

beforeAll(async () => {
    if (process.env.SKIP_MONGO_MEMORY_SERVER === "true") {
        return
    }

    mongoServer = await MongoMemoryServer.create()

    const mongoUri = mongoServer.getUri()

    await mongoose.connect(mongoUri)

    if (!redis.isOpen) {
        await connectRedis()
    }

}, 300000)


afterEach(async () => {
    if (!mongoServer) return

    const collections = mongoose.connection.collections

    for (const key in collections) {

        await collections[key].deleteMany({})

    }

})


afterAll(async () => {
    if (!mongoServer) return

    await mongoose.connection.close()

    if (mongoServer) {
        await mongoServer.stop()
    }

    if (redis.isOpen) {
        await redis.quit()
    }
})
