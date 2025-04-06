import { WebSocket } from "ws";
import { SubscriptionManager } from "./SubscriptionManager";
import { SubscriberManager } from "@repo/order-queue";

export class User {
  private id: string;
  private ws: WebSocket;
  private subscriptions: string[] = []

  constructor(id: string, ws: WebSocket) {
    this.id = id
    this.ws = ws
    this.addListeners()
  }

  private addListeners() {
    this.ws.on("message", (message: string) => {
      const parsedMessage = JSON.parse(message)
      if(parsedMessage.method === "subscribe_orderbook") {
        parsedMessage.events.forEach((evn: string) => {SubscriptionManager.getInstance().subscribe(this.id, evn)})
      }
      if(parsedMessage.method === "unsubscribe_orderbook") {
        parsedMessage.events.forEach((evn: string) => SubscriptionManager.getInstance().unsubscribe(this.id, evn))
      }
    })
  }

  subscribe(subscription: string) {
    this.subscriptions.push(subscription)
  }

  unsubscribe(subscription: string) {
    this.subscriptions = this.subscriptions.filter(sub => sub !== subscription)
  }

  emitMessage(message: string) {
    this.ws.send(JSON.stringify(message))
  }
}