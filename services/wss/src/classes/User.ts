import { WebSocket } from "ws";
import { SubscriptionManager } from "./SubscriptionManager.js";

export class User {
  private id: string;
  private ws: WebSocket;
  private subscriptions: string[] = []

  constructor(id: string, ws: WebSocket) {
    this.id = id
    this.ws = ws
    this.addListeners()
  }

  private handleMessage(message: string) {
    try {
      const parsedMessage = JSON.parse(message)
      if(parsedMessage.method === "subscribe_orderbook") {
        parsedMessage.events.forEach((evn: string) => {SubscriptionManager.getInstance().subscribe(this.id, evn)})
      }
      if(parsedMessage.method === "unsubscribe_orderbook") {
        parsedMessage.events.forEach((evn: string) => SubscriptionManager.getInstance().unsubscribe(this.id, evn))
      }
    } catch (error) {
      this.ws.send(`Received: ${message}`)
    }
  }
  private addListeners() {
    this.ws.on("message", (data: Buffer) => {
      this.handleMessage(data.toString())
    })

    this.ws.on("error", (error) => {
      console.error("WebSocket error:", error)
    }) 
  }
  subscribe(subscription: string) {
    this.subscriptions.push(subscription)
  }
  unsubscribe(subscription: string) {
    this.subscriptions = this.subscriptions.filter(sub => sub !== subscription)
  }
  emitMessage(message: string) {
    try {
      this.ws.send(message)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }
  getId(): string {
    return this.id
  }
}