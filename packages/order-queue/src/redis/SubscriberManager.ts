import { RedisClientType, createClient } from "redis";

export class SubscriberManager {
  private client: RedisClientType
  private static instance: SubscriberManager

  constructor() {
    this.client = createClient()
    this.client.connect()
    console.log("connected to redis")
  }

  public static getInstance() {
    if(!this.instance) {
      this.instance = new SubscriberManager()
    }
    return this.instance
  }

  public subscribeToChannel(channel: string, callback: any) {
    this.client.subscribe(channel, (message, channel) => {
      callback(channel, message)
    })
  }
  
  public unsubscribeToChannel(channel: string) {
    this.client.unsubscribe(channel)
  }
}