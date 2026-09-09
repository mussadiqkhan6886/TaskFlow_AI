import { createClient } from "redis";
import dotenv from "dotenv"

dotenv.config()

export const redis = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});


redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on('error', err => console.log('Redis Client Error', err));

export const connectRedis = async () => {
  await redis.connect();
};
