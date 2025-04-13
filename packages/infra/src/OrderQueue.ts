import { Queue } from "bullmq";

export const orderProcessor = new Queue("ORDER_PROCESSOR", {
  connection: {
    host: process.env.REDIS_HOST || "probo-redis",
    port: Number(process.env.REDIS_PORT) || 6379
  }
})