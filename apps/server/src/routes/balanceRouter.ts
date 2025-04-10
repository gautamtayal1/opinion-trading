import prisma from "@repo/db/client";
import { addToQueue } from "@repo/order-queue";
import { Router } from "express";

const balanceRouter: Router = Router()

balanceRouter.post("/", async (req, res) => {
    const { userId } = req.body
    const balance = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        balance: true
      }
    })
    res.json(balance)
})

balanceRouter.post("/add", async (req, res) => {
  try {
    addToQueue(req.body)
    res.json({ message: "Balance added to queue" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error adding balance to queue" })
  }
})

export { balanceRouter }