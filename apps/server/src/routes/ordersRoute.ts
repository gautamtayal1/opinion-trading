import { addToQueue } from "@repo/order-queue"
import { Router } from "express"

const orderRouter: Router = Router()

orderRouter.post("/create", async(req, res) => {
  try {
    console.log(req.body)
    await addToQueue(req.body)
    console.log("order submitted")
    res.status(200).json({ message: "Order submitted successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to submit order" })
  }
})

orderRouter.post("/cancel", async(req, res) => {
  try {
    console.log(req.body)
    await addToQueue(req.body)
    console.log("order submitted")
    res.status(200).json({ message: "Order submitted successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to submit order" })
  }
})

export {orderRouter}