import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { connectRedis, redis } from "../src/config/connectRedis"


let mongoServer: MongoMemoryServer

beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create()

    const mongoUri = mongoServer.getUri()

    await mongoose.connect(mongoUri)

    if (!redis.isOpen) {
        await connectRedis()
    }

})


afterEach(async () => {

    const collections = mongoose.connection.collections

    for (const key in collections) {

        await collections[key].deleteMany({})

    }

})


afterAll(async () => {

    await mongoose.connection.close()

    await mongoServer.stop()

    if (redis.isOpen) {
        await redis.quit()
    }
})