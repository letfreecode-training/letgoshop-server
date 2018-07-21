import * as redis from 'redis';

export const createRedisClient = () => redis.createClient();
