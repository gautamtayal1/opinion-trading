import {createClient, RedisClientType} from "redis"
import { UserManager } from "./UserManager"

export class SubscriptionManager {
  private static instance: SubscriptionManager
  private subscriptions: Map<string, string[]> = new Map()
  private reverseSubscription: Map<string, string[]> = new Map()
  private redisClient: RedisClientType

  private constructor() {
    this.redisClient = createClient()
    this.redisClient.connect()
  }

  public static getInstance() {
    if(!this.instance) {
      this.instance = new SubscriptionManager()
    }
    return this.instance
  }

  subscribe(userId: string, subscription: string) {
    if(this.subscriptions.get(userId)?.includes(subscription)) return
    const newSub = (this.subscriptions.get(userId) || []).concat(subscription)

    this.subscriptions.set(userId, newSub)

    const newRevSub = (this.reverseSubscription.get(subscription) || []).concat(userId)
    this.reverseSubscription.set(subscription, newRevSub)

    if(this.reverseSubscription.get(subscription)?.length === 1) {
      this.redisClient.subscribe(subscription, this.redisCallbackHandler.bind(this)) //check
    }
  }

  public unsubscribe(userId: string, subscription: string) {
    const subscriptions = this.subscriptions.get(userId)

    if(subscriptions) {
      this.subscriptions.set(userId, subscriptions.filter((sub) => sub !== subscription))
    }

    const reverseSubscription = this.reverseSubscription.get(subscription)
      this.reverseSubscription.set(subscription, reverseSubscription!.filter((sub) => sub !== userId))
      if(this.reverseSubscription.get(subscription)?.length === 0) {
        this.reverseSubscription.delete(subscription)
        this.redisClient.unsubscribe(subscription)
      }
  }

  private redisCallbackHandler (message: string, channel: string) {
    const parsedMessage = JSON.parse(message)
    this.reverseSubscription.get(channel)?.forEach((sub) => {
      // UserManager.getInstance().getUser(sub)?.emitMessage(parsedMessage) --check
      const user = UserManager.getInstance().getUser(sub)
      user?.emitMessage(JSON.stringify(parsedMessage))
    })
  }

  userLeft(userId: string) {
    console.log("user left: " + userId)
    this.subscriptions.get(userId)?.forEach(sub => this.unsubscribe(userId, sub))
  }

  getSubscriptions(userId: string) {
    return this.subscriptions.get(userId) || []
  }
}