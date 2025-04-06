import { Orderbook } from "./Orderbook";
import fs from "fs"
import {v4 as uuidv4} from "uuid"
import { RedisManager } from "@repo/order-queue";
import path from "path";
import { orderProcessor } from "@repo/order-queue";

interface UserBalance {
  available: number;
  locked: number;
}
export const EXAMPLE_MARKET = "csk_to_win_ipl_2025"
const ENGINE_SNAPSHOT_PATH = path.resolve(__dirname, "../../../../shared-state/snapshot.json")

export class Engine {
  private balances: Map<String, UserBalance> = new Map()
  private orderbooks: Orderbook[] = []
  public static instance: Engine | null = null

  constructor() {
    let snapshot = null
    try {
      snapshot = fs.readFileSync(ENGINE_SNAPSHOT_PATH)
    } catch (error) {
      console.log("no snapshot found")
    }
    if (snapshot) {
      console.log("snapshot available")
      const parsedSnapshot = JSON.parse(snapshot.toString())
      this.orderbooks = parsedSnapshot.orderbooks.map((book: any) => {
        return new Orderbook(book.bids, book.asks, book.market, book.lastTradeId, book.currentPrice)
      })

      if (parsedSnapshot.balances && Array.isArray(parsedSnapshot.balances)) {
        for (const [userId, balance] of parsedSnapshot.balances) {
          this.balances.set(userId, balance);
        }
        console.log("Balances restored from snapshot:", this.balances.size);
      }
    } else {
      this.orderbooks = [new Orderbook
        ([], [], EXAMPLE_MARKET, 1, 0)]
    }
    setInterval(() => {
      this.saveSnapshot()
      console.log("snapshot taken")
    }, 1000 * 5)
  }

  public static getInstance() {
    if(!this.instance) {
      this.instance = new Engine()
    }
    return this.instance
  }

  saveSnapshot() {
    const snapshotSnapshot = {
      orderbooks: this.orderbooks.map((book) => book.getSnapshot()
      ),
      balances: Array.from(this.balances.entries())
    }
    fs.writeFileSync(ENGINE_SNAPSHOT_PATH, JSON.stringify(snapshotSnapshot))
  }

  processOrder(order: any) {
    console.log("hello from engine")
    this.setBaseBalance(order.userId)
    
    switch(order.type){
      case "CREATE_ORDER":
        try {
          console.log("inside create order")
          const { fills, executedQty , orderId } = this.createOrder(
            order.market,
            order.price,
            order.quantity,
            order.side,
            order.userId
          )

          RedisManager.getInstance().publishToUser(order.userId, {
            type: "ORDER_PLACED",
            payload: {
              executedQty,
              fills,
              orderId
            }
          })
        } catch (error) {
          RedisManager.getInstance().publishToUser(order.userId, {
            type: "ORDER_CANCELLED",
            payload: {
              executedQty: 0,
              fills: null,
              orderId: ""
            }
          })
      }
      break;

      case "CANCEL_ORDER":
      break;

      case "GET_OPEN_ORDERS":
      break;

      case "ON_RAMP":
      break;

      case "GET_DEPTH":
      break;

      default:
        console.log("unknown order type: ", order.type)

    }
  }
  addOrderbook(orderbook: Orderbook) {
    this.orderbooks.push(orderbook)
    orderbook.asks.forEach((ask) => this.setBaseBalance(ask.userId))
    orderbook.bids.forEach((bid) => this.setBaseBalance(bid.userId))
  }

  createOrder(
    market: string,
    price: number,
    quantity: number,
    side: "yes" | "no", 
    userId: string
  ) {
    console.log("hello from createOrder")
    const orderbook = this.orderbooks.find((book) => book.market === market)
    if(!orderbook) throw new Error("orderbook not found")

    this.checkAndLockFunds(userId, quantity, price)

    const orderId = uuidv4()
    const order = {
      price,
      quantity,
      side,
      userId,
      filled: 0,
      orderId
    }
    const {executedQty, fills} = orderbook?.addOrder(order)
    console.log(executedQty, fills)
    this.updateBalance(userId, side, fills)
    this.createRedisTrade(market, fills)
    // this.updateRedisOrder(order, executedQty, fills, market)
    this.publishDepth(fills, price, side, market)
    // this.publishTrade(fills, userId, market)

    return { executedQty, fills, orderId }
  } 

  checkAndLockFunds(userId: string, quantity: number, price: number) {
    const bal = this.balances.get(userId)
    const cost = quantity * price
    if (bal?.available! < cost) {
      throw new Error('insufficient balance')
    }
    const availableBalance = bal?.available! - cost
    const lockedBalance = bal?.locked! + cost
    this.balances.set(userId, {
      available: availableBalance,
      locked: lockedBalance
    })
    console.log("locked funds")
  }

  updateBalance(
    userId: string, 
    side: "yes" | "no", 
    fills: any
  ) {
    const userBalance = this.balances.get(userId)
    const otherUserBalance = this.balances.get(fills.otherUserId)
    const updUserBalance = this.balances.get(userId)?.locked! - (fills.price * fills.qty)
    const updOtherUserBalance = this.balances.get(fills.otherUserId)?.locked! - (fills.price * fills.qty)

    if(side === "yes") {
     this.balances.set(userId, {
      available: userBalance?.available!,
      locked: updUserBalance
     })
    } else {
      const 
    }
  
  }
  createRedisTrade(
    market: string, 
    fills: any)
    {
    fills.forEach((fill: any) => {
      orderProcessor.add("process_order",
        {
        type: "TRADE_ADDED",
        data: {
          market: market,
          id: fill.tradeId.toString(),
          price: fill.price,
          quantity: fill.qty,
          timestamp: Date.now()
        }
      })
    });
  }
  // updateRedisOrder(order, executedQty, fills, market) {

  // }
  publishDepth(
    fills: any, 
    price: number, 
    side: "yes" | "no", 
    market: string
  ) {
    
  }
  // publishTrade(fills, userId, market) {

  // }
  setBaseBalance(userId: string) {
    if(!this.balances.has(userId)) {
      this.balances.set(userId, {
        available: 1000000,
        locked: 0
      })
    }
  }

}


