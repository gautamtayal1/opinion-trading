import { Orderbook } from "./Orderbook";
import fs from "fs"
import {v4 as uuidv4} from "uuid"
import { RedisManager } from "@repo/order-queue";
import path from "path";

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
    } else {
      this.orderbooks = [new Orderbook
        ([], [], EXAMPLE_MARKET, 1, 0)]
      this.setBaseBalance()
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

    // this.checkAndLockFunds()

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
    // this.updateBalance(userId, executedQty, fills)
    // this.createRedisTrade(userId, market, fills)
    // this.updateRedisOrder(order, executedQty, fills, market)
    // this.publishDepth(fills, price, side, market)
    // this.publishTrade(fills, userId, market)

    return { executedQty, fills, orderId }
  } 

  // checkAndLockFunds() {

  // }

  // updateBalance(userId, executedQty, fills) {

  // }
  // createRedisTrade(userId, market, fills) {

  // }
  // updateRedisOrder(order, executedQty, fills, market) {

  // }
  // publishDepth(fills, price, side, market) {

  // }
  // publishTrade(fills, userId, market) {

  // }
  setBaseBalance() {
    this.balances.set("1", {
      available: 10,
      locked: 10
    })
    this.balances.set("2", {
      available: 10,
      locked: 10
    })
  }
}