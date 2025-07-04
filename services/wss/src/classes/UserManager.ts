import { WebSocket } from "ws"
import { SubscriptionManager } from "./SubscriptionManager.js"
import { User } from "./User.js"

export class UserManager {
  public static instance: UserManager
  private users: Map<string, User> = new Map()
  
  private constructor() {}

  public static getInstance(){
    if(!this.instance) {
      this.instance = new UserManager()
    }
    return this.instance
  }

  public addUser(ws: WebSocket) {
    const id = this.getRandomId()
    const user = new User(id, ws)
    this.users.set(id, user)
    this.registerOnClose(ws, id)
    return user
  }

  private registerOnClose(ws: WebSocket, id: string) {
    ws.on("close", (code: number, reason: Buffer) => {
      console.log(`User ${id} disconnected (code: ${code}, reason: ${reason})`)
      this.users.delete(id)
      SubscriptionManager.getInstance().userLeft(id)
    })
  }

  public getUser(id: string) {
    return this.users.get(id)
  }

  private getRandomId(): string {
    return Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2, 15)
  }
}