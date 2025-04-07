import { Fill, MarketOrder, Orderbook } from "./Orderbook";
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

    }
    if (snapshot) {

      const parsedSnapshot = JSON.parse(snapshot.toString())
      this.orderbooks = parsedSnapshot.orderbooks.map((book: any) => {
        return new Orderbook(book.bids, book.asks, book.market, book.lastTradeId, book.currentPrice)
      })

      if (parsedSnapshot.balances && Array.isArray(parsedSnapshot.balances)) {
        for (const [userId, balance] of parsedSnapshot.balances) {
          this.balances.set(userId, balance);
        }

      }
    } else {
      this.orderbooks = [new Orderbook
        ([], [], EXAMPLE_MARKET, 1, 0)]
    }
    setInterval(() => {
      this.saveSnapshot()
      console.log("snapshot taken")
    }, 1000 * 30)
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

          const { fills, executedQty , orderId } = this.createOrder(
            order.market,
            order.price,
            order.quantity,
            order.side,
            order.userId
          )
          console.log("createOrder: order placed")

          RedisManager.getInstance().publishToUser(order.userId, {
            type: "ORDER_PLACED",
            payload: {
              executedQty,
              fills,
              orderId
            }
          })
          

          RedisManager.getInstance().publishToUser(order.userId, {
            type: "ORDER_PLACED",
            payload: {
              executedQty,
              fills,
              orderId
            }
          })
          console.log("publishToUser: order placed")
        } catch (error) {
          RedisManager.getInstance().publishToUser(order.userId, {
            type: "ORDER_CANCELLED",
            payload: {
              executedQty: 0,
              fills: null,
              orderId: ""
            }
          })
          console.log("publishToUser: order cancelled")
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
    orderbook.asks.forEach((ask: any) => this.setBaseBalance(ask.userId))
    orderbook.bids.forEach((bid: any) => this.setBaseBalance(bid.userId))
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
    this.updateBalance(userId, fills)
    this.createRedisTrade(market, fills)
    this.updateRedisOrder(order, executedQty, fills, market)
    this.publishDepth(market)
    this.publishTrade(fills, userId, market)

    console.log("createOrder: order created")
    return { executedQty, fills, orderId }
  } 
  checkAndLockFunds(userId: string, quantity: number, price: number) {
    const bal = this.balances.get(userId)
    const cost = quantity * price
    if (bal?.available! < cost) {
      throw new Error('Insufficient balance')
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
    fills: any
  ) {
    fills.forEach((fill: any) => {
      const balance = this.balances.get(userId)
      const totalCost = fill.price * fill.qty
  
      this.balances.set(userId, {
        available: balance?.available || 0,
        locked: balance?.locked || 0 - totalCost
      })
    })
    console.log("updateBalance: balance updated")
    
  }
  createRedisTrade(
    market: string, 
    fills: any)
    {
    fills.forEach((fill: any) => {
      orderProcessor.add("new_trade",
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
    console.log("createRedisTrade: trades added")
  }
  updateRedisOrder(
    order: MarketOrder, 
    executedQty: number, 
    fills: Fill[], 
    market: string
  ) {
    orderProcessor.add("update_order", {
      type: "ORDER_UPDATE",
      data: {
        orderId: order.orderId,
        executedQty: executedQty,
        price: order.price,
        market: market,
        quantity: order.quantity,
        side: order.side
      }
    })
    console.log("updateRedisOrder: order updated")
    fills.forEach((fill: any) => {
      orderProcessor.add("fill_added", {
        type: "ORDER_UPDATE",
        data: {
          orderId: fill.marketOrderId,
          executedQty: fill.qty
        }
      })
    });
    console.log("updateRedisOrder: fills added")
  }
  publishDepth(
    market: string
  ) {
    const orderbook = this.orderbooks.find((book) => book.market === market)
    if(!orderbook) {
      return ("orderbook not found")
    }

    const {bid, ask, currentPrice} = orderbook.getMarketDepth()
    RedisManager.getInstance().publishToChannel(`depth@${market}`, {
      stream: `depth@${market}`,
      data: {
        b: bid,
        a: ask,
        cp: currentPrice,
        e: "depth"
      }
    })
    console.log("depth published")
  }
  publishTrade(
    fills: Fill[], 
    userId: string, 
    market: string) {
    fills.forEach((fill) => {
      RedisManager.getInstance().publishToUser(`trade@${market}`, {
        stream: `trade@${market}`,
        data: {
          e: `trade@${market}`,
          t: fill.tradeId,
          p: fill.price,
          q: fill.qty.toString(),
          s: market
        }
      })
    })
    console.log("trade published")
  }
  setBaseBalance(userId: string) {
    if(!this.balances.has(userId)) {
      this.balances.set(userId, {
        available: 1000000,
        locked: 0
      })
    }
  }
  onRamp(userId: string, amount:number) {
    const existingBalance = this.balances.get(userId)
    this.balances.set(userId, {
      available: existingBalance?.available || 0 + amount,
      locked: existingBalance?.locked || 0
    })
  }
}


