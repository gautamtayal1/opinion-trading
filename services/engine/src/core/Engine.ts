import { Fill, MarketOrder, Orderbook } from "./Orderbook.js";
import {v4 as uuidv4} from "uuid"
import { RedisManager, orderProcessor } from "@repo/infra";
import { S3Manager } from "./S3Manager.js";

interface UserBalance {
  available: number;
  locked: number;
}

const ENGINE_KEY = "snapshot.json"

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
      new Orderbook(book.bids, book.asks, book.market, book.currentPrice)
    );

    if (snapshot.balances && Array.isArray(snapshot.balances)) {
      for (const [userId, balance] of snapshot.balances) {
        engine.balances.set(userId, balance);
      }
    }
  } else {
    engine.orderbooks = [new Orderbook([], [], "csk_to_win_ipl_2025", 0)];
  }
  setInterval(() => engine.saveSnapshot(), 1000 * 2);
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
    await S3Manager.uploadSnapshot(snapshot, ENGINE_KEY)
  }
  processOrder(order: any) {
    console.log("hello from engine")
    console.log(order)
    switch(order.type){
      case "CREATE_ORDER":
        try {

          this.createOrder(
            order.market,
            order.price,
            order.quantity,
            order.side,
            order.userId
          )
       
          
        } catch (error) {
          console.log(error)
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
          const remainingQuantity = order.quantity - order.filled

          const balance = this.balances.get(order.userId)
          if (balance) {
            balance.available += remainingQuantity * order.price
            balance.locked -= remainingQuantity * order.price
            this.publishDepthForCancel(order.price.toString(), market)
            this.updateRedisBalance(order.userId)
          }

          RedisManager.getInstance().publishToUser(order.userId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId,
              executedQty: 0,
              remainingQty: 0
            }
          })

          orderProcessor.add("cancel_order",
            {
            type: "ORDER_CANCELLED",
            data: {
              orderId: order.orderId
            }
          })
        } catch (error) {
          console.log(order.userId)
          console.log(error + "error cancelling order")
        }
      break;

      case "ON_RAMP":
        console.log("on ramp")
        console.log(order)
        const userId = order.userId
        const amount = Number(order.amount)
        this.onRamp(userId, amount)
      break;

      default:
        console.log("unknown order type: ", order.type)
    }
  }
  addOrderbook(orderbook: Orderbook) {
    this.orderbooks.push(orderbook)

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
    this.updateRedisOrder(order, executedQty, market)
    this.createRedisTrade(market, fills, userId, order.side)
    this.updateRedisDepth(market)
    this.publishDepth(market)
    this.publishTrade(fills, market)

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

    let totalCost = 0
    fills.forEach((fill: any) => {
      console.log(fill.price, fill.qty, userId, fills)
      totalCost += (10 - fill.price) * fill.qty
      
      const otherUserBal = this.balances.get(fill.otherUserId)
      this.balances.set(fill.otherUserId, {
        available: otherUserBal?.available || 0,
        locked: (otherUserBal?.locked || 0) - (fill.price * fill.qty)
      })
      this.updateRedisBalance(fill.otherUserId)
    })
    
    const currentBalance = this.balances.get(userId) || { available: 0, locked: 0 }
    this.balances.set(userId, {
      available: currentBalance.available,
      locked: currentBalance.locked - totalCost
    })
    this.updateRedisBalance(userId)
    console.log("updateBalance: balance updated")
  }
  createRedisTrade(
    market: string, 
    fills: any,
    userId: string,
    side: "yes" | "no"
  ) {
    fills.forEach((fill: any) => {
      orderProcessor.add("new_trade",
        {
        type: "FILLS_ADDED",
        data: {
          orderId: fill.marketOrderId,
          market,
          userId,
          side: side.toUpperCase(),
          otherUserId: fill.otherUserId,
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
    market: string
  ) {
    orderProcessor.add("update_order", {
      type: "ORDER_UPDATE",
      data: {
        userId: order.userId,
        orderId: order.orderId,
        executedQty: executedQty,
        price: order.price,
        market: market,
        quantity: order.quantity,
        side: order.side.toUpperCase(),
        isFilled: executedQty === order.quantity
      }
    })
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

  updateRedisDepth(
    market: string
  ) {
    const orderbook = this.orderbooks.find((book) => book.market === market)
    if(!orderbook) {
      return ("orderbook not found")
    }
    const {bid, ask, currentPrice} = orderbook.getMarketDepth()
    orderProcessor.add("update_depth", {
      type: "DEPTH_UPDATE",
      data: {
        bids: bid,
        asks: ask,
        currentPrice: currentPrice,
        eventSlug: market
      }
    })
  }
  publishTrade(
    fills: Fill[],  
    market: string) {
    fills.forEach((fill) => {
      console.log("other user id: " + fill.otherUserId)
      RedisManager.getInstance().publishToChannel(`fill@${fill.otherUserId}`, {
        stream: `fill@${fill.otherUserId}`,
        data: {
          e: `fill@${fill.otherUserId}`,
          t: fill.marketOrderId,
          q: fill.qty.toString(),
        }
      })
    })
    console.log("trade published")
  }

  onRamp(userId: string, amount:number) {
    const existingBalance = this.balances.get(userId)
    this.balances.set(userId, {
      available: (existingBalance?.available || 0) + amount,
      locked: existingBalance?.locked || 0
    })
    this.updateRedisBalance(userId)
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
  
  updateRedisBalance(userId: string) {
    const balance = this.balances.get(userId)
    orderProcessor.add("update_balance", {
      type: "UPDATE_BALANCE",
      data: {
        userId,
        balance: balance?.available
      }
    })
  }
}
