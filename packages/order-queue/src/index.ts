import { processOrders, addToQueue } from "./queue/orderQueue"

const startWorker = async() => {
  // processOrders()
  console.log("hello")
}

startWorker()
console.log("worker started")
export { addToQueue }