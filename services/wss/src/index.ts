import {WebSocketServer} from "ws"
import { UserManager } from "./classes/UserManager"

const wss = new WebSocketServer({port: 8081})

wss.on('listening', () => {
  console.log("WebSocketServer is running on port 8081")
})

wss.on("connection", (ws) => {
  UserManager.getInstance().addUser(ws)
})