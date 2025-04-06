
import { orderQueue } from "./bullQueue";

export const addToQueue = async(order: any)  => {
  try {
    console.log("addToQueue initiated")
    await orderQueue.add("add_to_queue", order)
    console.log("order pudshed queue")
  } catch (error) {
    console.error("Error adding order to queue:", error);
    throw error;
  }
}