import { createClient, RedisClientType} from "redis"

export class RedisManager {
  private client: RedisClientType
  public static instance: RedisManager

  constructor() {
    this.client = createClient({
       url: 'redis://probo-redis:6379'   
    })  
     
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })
    
    this.client.on('connect', () => {
      console.log('Connected to Redis')
    })
    
    console.log('Redis client created, attempting to connect...')
    this.client.connect().catch(err => {
      console.error('Failed to connect to Redis:', err)
    })
  }
  
  public getClient(): RedisClientType {
    return this.client
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager()
    }
    return this.instance
  }

  public publishToChannel (channel:any, message: any) {
    this.client.publish(channel, JSON.stringify(message))
  }

  public publishToUser(channel: any, message: any) {
    this.client.publish(channel, JSON.stringify(message));
  }
}