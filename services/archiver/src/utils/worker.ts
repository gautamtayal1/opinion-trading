import { Worker } from "bullmq";
import {RedisManager} from "@repo/order-queue"

const worker = new Worker("ORDER_PROCESSOR", async(job) => {
  const {type, data} = job.data
})

worker.on("completed", (job) => {
  console.log("job archived successfully")
})

worker.on("failed", (job) => {
  console.log("job archive failed")
})