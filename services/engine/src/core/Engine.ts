import { Orderbook } from "./Orderbook";
import fs from "fs"

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
    console.log("hello from engine")
  }

}