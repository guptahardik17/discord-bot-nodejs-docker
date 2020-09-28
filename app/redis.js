const Redis = require("ioredis");

const connect = () => {
    const redis = new Redis({
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        // This is the default value of `retryStrategy`
        retryStrategy: function (times) {
            var delay = Math.min(times * 50, 2000);
            return delay;
        },
        maxRetriesPerRequest: null,
    });

    redis.on('connect', function() {
        console.log('Redis client connected');
    });

    redis.on('disconnect', function() {
        console.log('Redis client disconnected');
    });
    
    redis.on('error', function (err) {
        console.log('Something went wrong with Redis ' + err);
    });

    return redis;
}

module.exports = { connect };
// module.exports = redis;