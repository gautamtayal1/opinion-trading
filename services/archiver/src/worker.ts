import { Worker } from "bullmq";
import {RedisManager} from "@repo/order-queue"
import prisma from "@repo/db/client";

;(async() => {
  const worker = new Worker("ORDER_PROCESSOR", async(job) => {
    const {type, data} = job.data
    
    if(type === "ORDER_UPDATE") {
      await prisma.order.create({
        data: {
          id: data.orderId,
          market: data.market,
          price: data.price,
          quantity: data.quantity,
          userId: data.userId,
          status: data.isFilled ? "FILLED" : "PENDING",
          executedQty: data.executedQty,
          side: data.side
        }
      })
    }
  
    if(type === "FILLS_ADDED") {
      await prisma.trade.create({
        data: {
          orderId: data.orderId ,
          quantity: data.quantity ,
          price: data.price ,
          eventSlug: data.market ,
          side: data.side,
          otherUserId: data.otherUserId,
        }
      })
      console.log("fill added")
      await prisma.order.update({
        where: {
          userId: data.otherUserId,
          id: data.orderId
        },
        data: {
          executedQty: {increment: data.quantity}
        }
      })
      console.log("fill updated")
    }
  }, {
    connection: {
      host: "localhost",
      port: 6379
    }
  })

  worker.on("completed", (job) => {
    console.log("job archived successfully", job.data)
  })
  
  worker.on("failed", (job, err) => {
    console.log("job archive failed", job?.data, err.message)
  })
})()


