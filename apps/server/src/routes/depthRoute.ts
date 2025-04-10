import prisma from "@repo/db/client"
import { Router } from "express"

const depthRouter: Router = Router()

depthRouter.post("/", async(req, res) => {
  try {
    const { eventSlug } = req.body
    const depth = await prisma.depth.findUnique({
      where: { eventSlug }
    })
    res.status(200).json(depth)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to get depth" })
  }
})

export {depthRouter}