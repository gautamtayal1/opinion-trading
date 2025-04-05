import { Engine } from "@repo/engine";
import { RedisManager } from "../redis/RedisManager"
import { orderQueue } from "./bullQueue";

const engine = new Engine()
const redisManager = RedisManager.getInstance();
const client = redisManager.getClient();

export const addToQueue = async(order: any)  => {
  try {
    console.log("addToQueue initiated")
    await orderQueue.add("process_orders", JSON.stringify(order))
    console.log("order pudshed queue")
  } catch (error) {
    console.error("Error adding order to queue:", error);
    throw error;
  }
}