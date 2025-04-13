import { addToQueue } from "./queue/orderQueue.js"

import { SubscriberManager } from "./redis/SubscriberManager.js"
import { orderProcessor } from "./queue/bullQueue.js"

console.log("redis host ", process.env.REDIS_HOST)
console.log("redis port ", process.env.REDIS_PORT)

SubscriberManager.getInstance()

export { addToQueue, SubscriberManager, orderProcessor }