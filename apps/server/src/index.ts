import express from "express";
import { orderRouter } from "./routes/ordersRoute.js";
import { eventRouter } from "./routes/eventsRoute.js";
import cors from "cors"
import { depthRouter } from "./routes/depthRoute.js";

const app = express()
const PORT = 8080

app.use(express.json())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,  
}))

app.use("/order", orderRouter)
app.use("/event", eventRouter)
app.use("/depth", depthRouter)

app.listen(PORT, () => {
  console.log("server running on port 8080")
})