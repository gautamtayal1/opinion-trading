import { addToQueue } from "./queue/orderQueue.js"
import { RedisManager } from "./redis/RedisManager.js"
import { SubscriberManager } from "./redis/SubscriberManager.js"
import { orderProcessor } from "./queue/bullQueue.js"

SubscriberManager.getInstance()

export { addToQueue, RedisManager, SubscriberManager, orderProcessor }