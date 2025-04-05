import { v4 as uuidv4 } from "uuid" 

export interface Order {
  price: number;
  quantity: number;
  filled: number;
  orderId: string;
  side: "yes" | "no";
  userId: string;
}

export interface Fill {
  price: number;
  qty: number;
  tradeId: string;
  otherUserId: string;
  marketOrderId: string;
}

export class Orderbook {
  bids: Order[];
  asks: Order[];
  market: string;
  lastTradeId: number;
  currentPrice: number;

  constructor(bids: Order[], asks: Order[], market: string, lastTradeId: number, currentPrice: number) {
    this.bids = bids;
    this.asks = asks;
    this.market = market;
    this.lastTradeId = lastTradeId;
    this.currentPrice = currentPrice || 0
  }

  addOrder(order: Order) {
    if(order.side === "yes") {
      const {executedQty, fills} = this.matchBid(order)
      order.filled = executedQty

      if (executedQty === order.quantity) {
        return {
          executedQty, fills
        }
      }
      this.bids.push(order)
      return {executedQty, fills}
    } else {
        const {executedQty, fills} = this.matchAsk(order)
        order.filled = executedQty

        if(executedQty === order.quantity){
          return {executedQty, fills}
        }
        this.asks.push(order)
        return {executedQty, fills}
    }
  }

  matchBid(order: Order) {
    const fills: Fill[] = []
    let executedQty = 0

    for (let i = 0; i < this.asks.length; i++) {
      if(order.price >= this.asks[i]?.price! &&  executedQty < order.quantity) {
        const filledQty = Math.min(order.quantity - executedQty, this.asks[i]?.quantity!)

        executedQty += filledQty
        if (this.asks[i]) {
          //@ts-ignore
          this.asks[i].filled += filledQty
        }
        fills.push({
          price: this.asks[i]?.price!,
          qty: filledQty,
          tradeId: uuidv4(),
          otherUserId: this.asks[i]?.userId!,
          marketOrderId: this.asks[i]?.orderId!,
        })
      }
    }
    for(let i = 0; i < this.asks.length; i++) {
      if(this.asks[i]?.filled === this.asks[i]?.quantity) {
        this.asks.splice(i, 1)
      }
    }
    console.log("executedQty", executedQty, "  ", fills)
    return {fills, executedQty}
  }

  matchAsk(order: Order) {
    const fills: Fill[] = []
    let executedQty = 0

    for (let i = 0; i < this.bids.length; i++) {
      if(this.bids[i]?.price! >= order.price && executedQty < order.quantity) {
        const filledQty = Math.min(this.bids[i]?.quantity!, order.quantity - executedQty)

        executedQty += filledQty
        if (this.bids[i]) {
          //@ts-ignore
          this.bids[i].filled += filledQty
        }

        fills.push({
          price: this.bids[i]?.price!,
          qty: filledQty,
          tradeId: uuidv4(),
          otherUserId: this.bids[i]?.userId!,
          marketOrderId: this.bids[i]?.orderId!
        })
      }
    }
    for (let i = 0; i < this.bids.length; i++) {
      if(this.bids[i]?.filled === this.bids[i]?.quantity) {
        this.bids.splice(i, 1)
        i--
      }
    }
    return {fills, executedQty}
  }

  getMarketDepth() {
    const bids: [string, string][] = []
    const asks: [string, string][] = []

    const bidsObject : {[key: string]: number} = {}
    const asksObject : {[key: string]: number} = {}

    for(let i = 0; i <= this.bids.length; i++){
      const priceKey = this.bids[i]?.price.toString()!
      if(!bidsObject[priceKey]){
        bidsObject[priceKey] = 0
      }
      
      bidsObject[priceKey] += this.bids[i]?.quantity!
    }

    for (const key in bidsObject){
      bids.push([key, bidsObject[key]?.toString()!])
    }

    for (let i = 0; i < this.asks.length; i++) {
      const priceKey = this.asks[i]?.price.toString()!
      if(!asksObject[priceKey]){
        asksObject[priceKey] = 0
      }
      asksObject[priceKey] += this.asks[i]?.quantity!
    }

    for (const key in asksObject) {
      asks.push([key, asksObject[key]?.toString()!])
    }
    return {bids, asks}
  }

  getOpenOrders(userId: string):Order[] {
    const bids = this.bids.filter((bid) => bid.userId === userId)
    const asks = this.asks.filter((asks) => asks.userId === userId)

    return [...bids, ...asks]
  }

  cancelBid(order: Order) {
    const index = this.bids.findIndex(bid => bid.orderId === order.orderId)
    if (index !== -1) {
      const price = this.bids[index]?.price
      this.bids.splice(index, 1)
      return price
    }
  }

  cancelAsk(order: Order) {
    const index = this.asks.findIndex(ask => ask.orderId === order.orderId)
    if (index !== -1) {
      const price = this.asks[index]?.price
      this.asks.splice(index, 1)
      return price
    }
  }

  getSnapshot() {
    return {
      bids: this.bids,
      asks: this.asks,
      lastTradeId: this.lastTradeId,
      currentPrice: this.currentPrice
    }
  }
}