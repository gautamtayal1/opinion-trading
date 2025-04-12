import { addToQueue } from "./queue/orderQueue.js"

import { SubscriberManager } from "./redis/SubscriberManager.js"
import { orderProcessor } from "./queue/bullQueue.js"

SubscriberManager.getInstance()

export { addToQueue, SubscriberManager, orderProcessor }