import { redis } from "../../config/connectRedis"

export const deleteCacheByPattern = async (pattern: string) => {
    const keys : string[] = []
    const iterator = redis.scanIterator({MATCH: pattern})
    for await (const key of iterator){
        keys.push(...key)
    }

    if(keys.length){
        await redis.del(keys)
    }
}

export const deleteUserCache = async () => {
    await deleteCacheByPattern("users*");
};

export const deleteNoteCache = async () => {
    await deleteCacheByPattern("notes*");
};