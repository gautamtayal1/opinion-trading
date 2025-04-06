import { RedisManager } from "../redis/RedisManager"
import { orderQueue } from "./bullQueue";

export const addToQueue = async(order: any)  => {
  try {
    console.log("addToQueue initiated")
    await orderQueue.add("process_orders", order)
    console.log("order pudshed queue")
  } catch (error) {
    console.error("Error adding order to queue:", error);
    throw error;
  }
}