import { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>

let redisClientPromise: Promise<RedisClient | null> | null = null

function getRedisUrl() {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL
    }

    if (process.env.REDIS_HOST) {
        const host = process.env.REDIS_HOST
        const port = process.env.REDIS_PORT || '6379'
        const password = process.env.REDIS_PASSWORD

        if (password) {
            return `redis://:${password}@${host}:${port}`
        }

        return `redis://${host}:${port}`
    }

    return null
}

async function connectRedis() {
    const redisUrl = getRedisUrl()
    if (!redisUrl) {
        return null
    }

    const client = createClient({ url: redisUrl })

    client.on('error', (error) => {
        console.error('Redis client error', error)
    })

    try {
        await client.connect()
        return client
    } catch (error) {
        console.error('Failed to connect to Redis', error)
        return null
    }
}

export async function getRedisClient() {
    if (!redisClientPromise) {
        redisClientPromise = connectRedis()
    }

    const client = await redisClientPromise
    if (!client) {
        return null
    }

    if (!client.isOpen) {
        try {
            await client.connect()
        } catch (error) {
            console.error('Failed to reconnect Redis', error)
            return null
        }
    }

    return client
}
