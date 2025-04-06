import { Queue } from "bullmq";

export const orderQueue = new Queue("ORDER_QUEUE", {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})

export const orderProcessor = new Queue("ORDER_PROCESSOR", {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})