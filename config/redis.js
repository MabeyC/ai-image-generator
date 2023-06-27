const redis = require('redis');
const RedisStore = require('connect-redis').default;

const config = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
}

const redisClient = redis.createClient(config);

// Initialize store
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "ai-image-generator:"
});

module.exports = { redisClient, redisStore };