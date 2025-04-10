import express from "express";
import { orderRouter } from "./routes/ordersRoute.js";
import { eventRouter } from "./routes/eventsRoute.js";
import cors from "cors"
import { depthRouter } from "./routes/depthRoute.js";
import { balanceRouter } from "./routes/balanceRouter.js";
const app = express()
const PORT = 8080

app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true,  
}, ))

app.use("/order", orderRouter)
app.use("/event", eventRouter)
app.use("/depth", depthRouter)
app.use("/balance", balanceRouter)

app.listen(PORT, () => {
  console.log("server running on port 8080")
})