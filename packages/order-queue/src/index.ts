import { addToQueue } from "./queue/orderQueue"
import { RedisManager } from "./redis/RedisManager"
import { SubscriberManager } from "./redis/SubscriberManager"
import { orderProcessor } from "./queue/bullQueue"

SubscriberManager.getInstance()

export { addToQueue, RedisManager, SubscriberManager, orderProcessor }