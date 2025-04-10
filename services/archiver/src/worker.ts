import { Worker } from "bullmq";
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

    if(type === "ORDER_CANCELLED") {
      await prisma.order.delete({
        where: {
          id: data.orderId
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

    if(type === "DEPTH_UPDATE") {
      console.log("depth update", data)
      try {
        // First check if a record exists
        const existingDepth = await prisma.depth.findFirst({
          where: {
            eventSlug: data.eventSlug
          }
        });
        
        if (existingDepth) {
          // Update if exists
          await prisma.depth.update({
            where: { id: existingDepth.id },
            data: {
              bids: data.bids,
              asks: data.asks,
              currentPrice: data.currentPrice
            }
          });
          console.log("Updated existing depth record:", existingDepth.id);
        } else {
          // Create new record
          const newDepth = await prisma.depth.create({
            data: {
              eventSlug: data.eventSlug,
              bids: data.bids,
              asks: data.asks,
              currentPrice: data.currentPrice
            }
          });
          console.log("Created new depth record:", newDepth.id);
        }
        console.log("depth operation completed successfully")
      } catch (error) {
        console.error("Failed to update depth:", error)
      }
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


