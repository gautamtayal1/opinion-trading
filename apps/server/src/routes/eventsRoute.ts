import { Router } from "express";
import prisma from "@repo/db/client";
const eventRouter: Router = Router()

eventRouter.post("/create", async(req, res) => {
  try {
    await prisma.event.create({
      data: {
        id: req.body.id,
        slug: req.body.slug,
        description: req.body.description,
        title: req.body.title,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        sot: req.body.sot,
        status: req.body.status,
      }
    })
    res.status(200).json({ message: "Order submitted successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to submit order" })
  }
})

eventRouter.delete("/delete", async(req, res) => {
  try {
    const { id } = req.body
    await prisma.event.delete({
      where: { id }
    })
    res.status(200).json({ message: "Order submitted successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to submit order" })
  }
})

eventRouter.patch("/update", async(req, res) => {
  try {
    const { id } = req.body
    await prisma.event.update({
      where: { id },
      data: {
        id: req.body.id,
        slug: req.body.slug,
        description: req.body.description,
        title: req.body.title,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        sot: req.body.sot,
        status: req.body.status,
      }
    })
    res.status(200).json({ message: "Order submitted successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to submit order" })
  }
})

export {eventRouter}