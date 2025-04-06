import { Orderbook, Order } from "./Orderbook";
import { v4 as uuidv4 } from "uuid";
import { Engine } from "./Engine";

const seedOrderbook = () => {
  const bids: Order[] = [
    {
      price: 49000,
      quantity: 1.2,
      filled: 0,
      orderId: uuidv4(),
      side: "yes",
      userId: "user1"
    },
    {
      price: 48000,
      quantity: 0.8,
      filled: 0,
      orderId: uuidv4(),
      side: "yes",
      userId: "user2"
    }
  ];

  const asks: Order[] = [
    {
      price: 50000,
      quantity: 1.0,
      filled: 0,
      orderId: uuidv4(),
      side: "no",
      userId: "user3"
    },
    {
      price: 51000,
      quantity: 0.5,
      filled: 0,
      orderId: uuidv4(),
      side: "no",
      userId: "user4"
    }
  ];
  const orderbook = new Orderbook(bids, asks, "BTC-INR", 1, 50000);
  const engine = Engine.getInstance()
  engine.addOrderbook(orderbook)


  console.log("=== Orderbook Seeded ===");
  console.log("Bids:", orderbook.bids);
  console.log("Asks:", orderbook.asks);
  console.log("Market Depth:", orderbook.getMarketDepth());
};

seedOrderbook();
