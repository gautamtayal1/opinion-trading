import { RedisManager } from "./RedisManager.js";
import { orderProcessor } from "./OrderQueue.js";

console.log("redis url ", process.env.REDIS_HOST)
console.log("redis port ", process.env.REDIS_PORT)

export { RedisManager, orderProcessor };
