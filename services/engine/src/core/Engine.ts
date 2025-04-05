import { Orderbook } from "./Orderbook";
import fs from "fs"
import {v4 as uuidv4} from "uuid"
import { RedisManager } from "@repo/order-queue";

interface UserBalance {
  available: number;
  locked: number;
}
export const EXAMPLE_MARKET = "csk_to_win_ipl_2025"
export class Engine {
  private balances: Map<String, UserBalance> = new Map()
  private orderbooks: Orderbook[] = []

  constructor() {
    let snapshot = null
    try {
      snapshot = fs.readFileSync("./snapshot.json")
    } catch (error) {
      console.log("no snapshot found")
    }
    if (snapshot) {
      const parsedSnapshot = JSON.parse(snapshot.toString())
      this.orderbooks = parsedSnapshot.orderbooks.map((book: any) => {
        new Orderbook(book.bids, book.asks, book.market, book.lastTradeId, book.currentPrice)
      })
    } else {
      this.orderbooks = [new Orderbook([], [], EXAMPLE_MARKET, 1, 0)]
      //this.setBaseBalance()
    }
    setInterval(() => {
      //this.saveSnapshot()
    }, 1000 * 3)
  }

  processOrder(order: any) {
    console.log(order)
    switch(order.type){
      case "CREATE_ORDER":
        try {
          const { fills, executedQty, orderId } = this.createOrder(
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
    }
  }

  createOrder(market, price, quantity, side, userId) {
    const orderbook = this.orderbooks.find((book) => book.market === market)
    if(!orderbook) return "orderbook not found"

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

    this.updateBalance(userId, executedQty, fills)
    this.createRedisTrade(userId, market, fills)
    this.updateRedisOrder(order, executedQty, fills, market)
    this.publishDepth(fills, price, side, market)
    this.publishTrade(fills, userId, market)

    return { executedQty, fills, orderId }
  } 

  updateBalance(userId, executedQty, fills) {

  }
  createRedisTrade(userId, market, fills) {

  }
  updateRedisOrder(order, executedQty, fills, market) {

  }
  publishDepth(fills, price, side, market) {

  }
  publishTrade(fills, userId, market) {

  }
}