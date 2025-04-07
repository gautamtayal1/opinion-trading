import {WebSocketServer} from "ws"
import { UserManager } from "./classes/UserManager"

const wss = new WebSocketServer({port: 8081})

wss.on('listening', () => {
  console.log("WebSocketServer is running on port 8081")
})

wss.on("connection", (ws) => {
  try {
    const user = UserManager.getInstance().addUser(ws)
    console.log(`New user connected: ${user.getId()}`)
  } catch (error) {
    console.error("Error handling new connection:", error)
    ws.close()
  }
})

wss.on("error", (error) => {
  console.error("WebSocket server error:", error)
})