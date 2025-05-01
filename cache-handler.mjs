// cache-config.mjs (place this in your project root)
import { createClient } from 'redis'
import crypto from 'crypto'

Error.stackTraceLimit = Infinity

// The invalidation script, identical to your TypeScript version
const INVALIDATE_TAG_SCRIPT = `
local tagKey = KEYS[1]

-- Get all keys associated with this tag
local keys = redis.call('SMEMBERS', tagKey)

-- Delete all the cache keys
for i, key in ipairs(keys) do
  redis.call('DEL', key)
end

-- Remove the tag set itself
redis.call('DEL', tagKey)

return #keys  -- Return number of invalidated keys
`

// Pre-calculate the SHA-1 hash
const INVALIDATE_TAG_SCRIPT_SHA = crypto
  .createHash('sha1')
  .update(INVALIDATE_TAG_SCRIPT)
  .digest('hex')

// Module-level shared connection variables
let sharedClient = null
let connectionPromise = null

// Reference : https://github.com/leerob/next-self-host/blob/main/cache-handler.mjs
// The main cache handler class that Next.js will use
class ConfigRedisCache {
  // Static variables to implement singleton pattern
  static instance = null

  // Factory method to get the singleton instance
  static getInstance() {
    if (!ConfigRedisCache.instance) {
      ConfigRedisCache.instance = new ConfigRedisCache()
    }
    return ConfigRedisCache.instance
  }

  constructor() {
    // If singleton instance exists, return it
    if (ConfigRedisCache.instance) {
      return ConfigRedisCache.instance
    }

    // Set instance variables
    this.prefix = `${process.env.APP_ENV || 'prefix'}:`
    this.invalidateTagSha = INVALIDATE_TAG_SCRIPT_SHA

    // Store as singleton
    ConfigRedisCache.instance = this
  }

  async ensureConnection() {
    // Initialize client if not already done
    if (!sharedClient) {
      sharedClient = createClient({
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
      })

      sharedClient.on('error', (err) => {
        console.error('Redis connection error:', err)
        // Reset connection promise on error so we can try again
        connectionPromise = null
      })
    }

    // If already connecting, wait for that promise to resolve
    if (!connectionPromise) {
      // Only create a new connection promise if one doesn't exist
      if (!sharedClient.isOpen) {
        connectionPromise = sharedClient.connect().catch((err) => {
          console.error('Redis connection failed:', err)
          // Reset on error
          connectionPromise = null
          throw err
        })
      } else {
        // Client is already connected, resolve immediately
        connectionPromise = Promise.resolve()
      }
    }

    // Wait for the connection
    return connectionPromise
  }

  getCacheKey(key) {
    return `${this.prefix}${key}`
  }

  getTagKey(tag) {
    return `${this.prefix}tag:${tag}:keys`
  }

  async get(key) {
    try {
      await this.ensureConnection()
      const cacheKey = this.getCacheKey(key)
      const value = await sharedClient.get(cacheKey)
      if (!value) return null
      return JSON.parse(value)
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  // async set(key, data, { revalidate, tags } = {}) {
  async set(key, data, ctx = {}) {
    let tags = ctx.tags || []
    const revalidate = ctx.revalidate

    try {
      await this.ensureConnection()
      const cacheKey = this.getCacheKey(key)
      const pipeline = sharedClient.multi()

      if (data && data.headers && data.headers['x-next-cache-tags']) {
        const headerTags = data.headers['x-next-cache-tags'].split(',')
        tags = [...new Set([...tags, ...headerTags])]
      }

      let setOptions = {}
      if (revalidate) {
        const expiryTimestamp = Math.floor(Date.now() / 1000) + revalidate
        setOptions.EXAT = expiryTimestamp
      }

      const entry = {
        value: data,
        lastModified: Date.now(),
        tags,
      }

      pipeline.set(cacheKey, JSON.stringify(entry), setOptions)

      if (tags && tags.length > 0) {
        for (const tag of tags) {
          const tagKey = this.getTagKey(tag)
          pipeline.sAdd(tagKey, cacheKey)
        }
        // If the tag has an expiry, make sure the tag set expires too
        if (setOptions.EXAT) {
          pipeline.expireAt(tagKey, setOptions.EXAT)
        }
      }

      await pipeline.exec()
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  async revalidateTag(tags) {
    const tagsArray = Array.isArray(tags) ? tags : [tags]
    for (const tag of tagsArray) {
      try {
        await this.ensureConnection()
        const tagKey = this.getTagKey(tag)
        try {
          await sharedClient.evalSha(this.invalidateTagSha, {
            keys: [tagKey],
            arguments: [],
          })
        } catch (error) {
          if (error.message && error.message.includes('NOSCRIPT')) {
            this.invalidateTagSha = await sharedClient.scriptLoad(INVALIDATE_TAG_SCRIPT)
            await sharedClient.evalSha(this.invalidateTagSha, {
              keys: [tagKey],
              arguments: [],
            })
          }
          throw error
        }
      } catch (error) {
        console.error('Cache revalidateTag error:', error)
      }
    }
  }
}

// Export the class directly
export default ConfigRedisCache
