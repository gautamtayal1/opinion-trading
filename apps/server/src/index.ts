import express from "express";
import { orderRouter } from "./routes/ordersRoute";
import { eventRouter } from "./routes/eventsRoute";

const app = express()
const PORT = 8080

app.use(express.json())

app.use("/order", orderRouter)
app.use("/event", eventRouter)

app.listen(PORT, () => {
  console.log("server running on port 8080")
})