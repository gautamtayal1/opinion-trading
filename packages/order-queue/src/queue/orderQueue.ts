import { RedisManager } from "../redis/RedisManager"

// const TEST_ORDER = {
  
// }

const redisManager = RedisManager.getInstance();
const client = redisManager.getClient();

export const addToQueue = async(order: any)  => {
  try {
    console.log("addToQueue initiated")
    await client.lPush("ORDER_QUEUE", JSON.stringify(order))
    console.log("order pudshed queue")
  } catch (error) {
    console.error("Error adding order to queue:", error);
    throw error;
  }
}

export const processOrders = async() => {
  while(true) {
    try {
      console.log("popping")
      const order = await client.brPop("ORDER_QUEUE", 20000)
      if(order) {
        const parsedOrder = JSON.parse(order.element)
        // TODO: Import or define Engine class
        console.log(parsedOrder)
      }
      console.log("popped")
    } catch (error) {
      console.log(error)
    }
  }
}