import { Fill, MarketOrder, Orderbook } from "./Orderbook";
import fs from "fs"
import {v4 as uuidv4} from "uuid"
import { RedisManager } from "@repo/order-queue";
import path from "path";
import { orderProcessor } from "@repo/order-queue";
import { S3Manager } from "./S3Manager";

interface UserBalance {
  available: number;
  locked: number;
}

export const EXAMPLE_MARKET = "csk_to_win_ipl_2025"
const ENGINE_KEY = "engine/snapshot.json"

export class Engine {
  private balances: Map<String, UserBalance> = new Map()
  private orderbooks: Orderbook[] = []
  public static instance: Engine | null = null

  constructor() {}

static async create() {
  const engine = new Engine();
  const snapshot = await S3Manager.downloadSnapshot(ENGINE_KEY);

  if (snapshot) {
    engine.orderbooks = snapshot.orderbooks.map((book: any) =>
      new Orderbook(book.bids, book.asks, book.market, book.lastTradeId, book.currentPrice)
    );

    if (snapshot.balances && Array.isArray(snapshot.balances)) {
      for (const [userId, balance] of snapshot.balances) {
        engine.balances.set(userId, balance);
      }
    }
  } else {
    engine.orderbooks = [new Orderbook([], [], EXAMPLE_MARKET, 1, 0)];
  }

  setInterval(() => engine.saveSnapshot(), 1000 * 3);
  return engine;
}

  public static getInstance() {
    if(!this.instance) {
      throw new Error("Engine not initialized. Use Engine.create()");
    }
    return this.instance
  }
  private async saveSnapshot() {
    const snapshot = {
      orderbooks: this.orderbooks.map((book) => book.getSnapshot()
      ),
      balances: Array.from(this.balances.entries())
    }
    // fs.writeFileSync(ENGINE_SNAPSHOT_PATH, JSON.stringify(snapshotSnapshot))
    await S3Manager.uploadSnapshot(snapshot, ENGINE_KEY)
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
          console.log("publishToUser: order cancelled", error)
        }
      break;

      case "CANCEL_ORDER":
        try {
          const orderbook = this.orderbooks.find((book) => book.market === order.market)
          const orderId = order.orderId
          const market = order.market
          if(!orderbook) {
            throw new Error("orderbook not found")
          }
          
          const cancelOrder = orderbook.bids.find((bid) => bid.orderId === orderId) || orderbook.asks.find((ask) => ask.orderId === orderId)
          
          if (!cancelOrder) {
            console.log("order not found")
          }

          orderbook.cancelOrder(order.orderId, order.userId)
          const remainingQuantity = order.quantity - order.filled  //TODO - filled not assigned on order, given after the order is created - recheck the logic

          const balance = this.balances.get(order.userId)
          if (balance) {
            balance.available += remainingQuantity * order.price
            balance.locked -= remainingQuantity * order.price
            this.publishDepthForCancel(order.price.toString(), market)
          }

          RedisManager.getInstance().publishToUser(order.userId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId,
              executedQty: 0,
              remainingQty: 0
            }
          })
        } catch (error) {
          console.log(error + "error cancelling order")
        }
      break;

      case "GET_OPEN_ORDERS":
        try {
          const orderbook = this.orderbooks.find((book) => book.market === order.market)
          if(!orderbook) return

          const userOrders = orderbook.getOpenOrders(order.userId)
          RedisManager.getInstance().publishToUser(order.userId, {
            type: "OPEN_ORDERS",
            payload: userOrders
          })
        } catch (error) {
          console.log(error)
        }
      break;

      case "ON_RAMP":
        const userId = order.userId
        const amount = Number(order.amount)
        this.onRamp(userId, amount)
      break;

      case "GET_DEPTH":
        try {
          const orderbook = this.orderbooks.find((book) => book.market === order.market)
          if(!orderbook) return 

          RedisManager.getInstance().publishToUser(order.userId, {
            type: "DEPTH",
            payload: orderbook.getMarketDepth()
          })
        } catch (error) {
          console.log(error)
        }
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
      console.log("total cost: " + totalCost)
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
  publishDepthForCancel(price: string, market: string) {
    const orderbook = this.orderbooks.find((book) => book.market === market)
    if (!orderbook) return

    const {bid, ask, currentPrice} = orderbook.getMarketDepth()
    const updatedBids = bid.filter((b) => b[0] === price)
    const updatedAsks = ask.filter((a) => a[0] === price)

    RedisManager.getInstance().publishToChannel(`depth@${market}`, {
      stream: `depth@${market}`,
      data: {
        a: updatedAsks.length ? updatedAsks : [[price, "0"]],
        b: updatedBids.length ? updatedBids : [[price, "0"]],
        e: "depth",
        cp: currentPrice
      }
    })
  }
}


