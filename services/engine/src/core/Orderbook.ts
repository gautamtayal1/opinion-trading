import {v4 as uuidv4} from "uuid"
const UNIT_VALUE = 10

export interface MarketOrder {
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
  bids: any[];
  asks: any[];
  market: string;
  lastTradeId: number;
  currentPrice: number;

  constructor(
    bids: any[] = [],
    asks: any[] = [],
    market: string = "",
    lastTradeId: number = 1,
    currentPrice: number = UNIT_VALUE / 2
  ) {
    this.bids = bids;
    this.asks = asks;
    this.market = market;
    this.lastTradeId = lastTradeId;
    this.currentPrice = currentPrice;

    this.sortOrder()
  }
  
  private sortOrder () {
    this.bids.sort((a, b) => b.price - a.price)
    this.asks.sort((a, b) => a.price - b.price)
  }

  addOrder (order: MarketOrder) {
    if (order.side === "yes") {
      console.log("matching bid")
      const {executedQty, fills} = this.matchBid(order)
      order.filled = executedQty

      if(executedQty < order.quantity) {
        this.bids.push({...order, quantity: order.quantity - executedQty, filled: 0})
        this.sortOrder()
      }

      if(fills.length > 0) {
        const lastFill = fills[fills.length - 1]
        if (lastFill) {
          this.updateCurrentPrice(lastFill.price)
          console.log("current price updated to: ", this.currentPrice)
        }
      }
      return { executedQty, fills }

    } else {
      const {executedQty, fills} = this.matchAsk(order)
      order.filled = executedQty

      if(executedQty < order.quantity) {
        this.asks.push({...order, quantity: order.quantity - executedQty, filled: 0})
        this.sortOrder()
      }

      if(fills.length > 0) {
        const lastFill = fills[fills.length - 1]
        if(lastFill) {
          this.updateCurrentPrice(lastFill.price)
        }
      }
      return { executedQty, fills }
    }
  }

  matchBid (order: MarketOrder) {
    let fills: Fill[] = []
    let executedQty = 0
    
    for (let i = 0; i < this.asks.length && order.quantity > executedQty; i++) {
      const ask = this.asks[i]
      if (ask.userId !== order.userId) {
        if (order.price + ask?.price === 10) {
          const tradedQty = Math.min(order.quantity - executedQty, ask.quantity - ask.filled)
          if (tradedQty === 0) continue
  
          executedQty += tradedQty
          ask.filled += tradedQty
  
          fills.push({
            price: ask.price,
            qty: executedQty,
            otherUserId: ask.otherUserId,
            tradeId: uuidv4(),
            marketOrderId: ask.orderId
          })
        } 
      }
    }
    this.asks = this.asks.filter((ask) => ask.filled < ask.quantity)
    return {executedQty, fills}
  }

  matchAsk (order: MarketOrder) {
    let fills: Fill[] = []
    let executedQty = 0

    for(let i = 0; i < this.bids.length && executedQty < order.quantity ; i++) {
      const bids = this.bids[i]
      if (bids.userId !== order.userId) {
        if(order.price + bids.price === 10) {
          const tradedQty = Math.min(order.quantity - executedQty, bids.quantity - bids.filled)
          if (tradedQty === 0) continue
  
          executedQty += tradedQty
          bids.filled += tradedQty
  
          fills.push({
            price: bids.price,
            qty: executedQty,
            tradeId: uuidv4(),
            otherUserId: bids.otherUserId,
            marketOrderId: bids.orderId
          })
        }
      } 
    }
    this.bids = this.bids.filter((bid) => bid.filled < bid.quantity)

    return {executedQty, fills}
  }

  updateCurrentPrice (tradePrice: number) {
    this.currentPrice = tradePrice
  }

  getMarketDepth () {
    const bidLevels = this.aggregateByPrice(this.bids, true)
    const askLevels = this.aggregateByPrice(this.asks, false)

    return {
      ask: askLevels,
      bid: bidLevels,
      currentPrice: this.currentPrice
    }
  }

  aggregateByPrice (orders: MarketOrder[], descending: boolean = true) {
    const priceMap = new Map()

    orders.forEach((order) => {
      if(order.quantity > 0) {
        priceMap.set(order.price, (priceMap.get(order.price) || 0) + order.quantity)
      }
    })

    const entries = Array.from(priceMap.entries())
    .map(([price, quantity]) => [price.toString(), quantity.toString()]);
    
    return descending 
      ? entries.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))  
      : entries.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  }

  getOpenOrders (userId: string) {
    const userBids = this.bids.filter((bid) => bid.userId === userId)
    const userAsks = this.asks.filter((ask) => ask.userId === userId)

    return [...userAsks, ...userBids]
  }

  cancelOrder (orderId: string, userId: string) {
    const bidIndex = this.bids.findIndex((bid) => bid.userId === userId && bid.orderId === orderId)

    if(bidIndex !== -1) {
      this.bids.splice(bidIndex, 1)
      console.log("order cancelled")
    }
    const askIndex = this.asks.findIndex((ask) => ask.userId === userId && ask.orderId === orderId)

    if(askIndex !== -1) {
      this.asks.splice(askIndex, 1)
      console.log("order cancelled")
    }
    console.log("order/user not found")
  }

  getSnapshot () {
    return {
      bids: this.bids,
      asks: this.asks,
      market: this.market,
      lastTradeId: this.lastTradeId,
      currentPrice: this.currentPrice
    };
  }
}