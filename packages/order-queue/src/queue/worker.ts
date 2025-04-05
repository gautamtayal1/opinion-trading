import { Worker } from "bullmq"
import { Engine } from "@repo/engine"

const engine = new Engine()

const worker = new Worker("ORDER_QUEUE",
  async(job) => {
    const order = job.data
    console.log("processing data")
    engine.processOrder(order)
  },
  {
    connection:{
      host: "localhost",
      port: 6379
    }
  }
)

worker.on("completed", (job) => {
  console.log(`job completed ${job.id}`)
})

worker.on("failed", (job, err) => {
  console.log(`job failed ${job?.id}`, err)
})