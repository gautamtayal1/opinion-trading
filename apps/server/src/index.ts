import { addToQueue } from "@repo/order-queue";
import express from "express";

const app = express()
const PORT = 8080

// Add middleware to parse JSON request bodies
app.use(express.json())

app.post("/order", async(req, res) => {
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

app.listen(PORT, () => {
  console.log("server running on port 8080")
})