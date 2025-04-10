import { Orderbook } from "./Orderbook.js";
import { v4 as uuidv4 } from "uuid";
import { Engine } from "./Engine.js";
import dotenv from "dotenv";
dotenv.config();


const seedOrderbook = async() => {
  console.log("S3 BUCKET =", process.env.S3_BUCKET_NAME);

  const bids: any[] = [
    {
      price: 5,
      quantity: 2,
      filled: 0,
      orderId: uuidv4(),
      side: "yes",
      userId: "user1"
    },
    {
      price: 5,
      quantity: 1,
      filled: 0,
      orderId: uuidv4(),
      side: "yes",
      userId: "user2"
    }
  ];

  const asks: any[] = [
    {
      price: 5,
      quantity: 2,
      filled: 0,
      orderId: uuidv4(),
      side: "no",
      userId: "user3"
    },
    {
      price: 7,
      quantity: 5,
      filled: 0,
      orderId: uuidv4(),
      side: "no",
      userId: "user4"
    }
  ];
  const orderbook = new Orderbook(bids, asks, "BTC-INR", 1, 50000);
  const engine = await Engine.create()
  Engine.instance = engine
  engine.addOrderbook(orderbook)


  console.log("=== Orderbook Seeded ===");
  console.log("Bids:", orderbook.bids);
  console.log("Asks:", orderbook.asks);
  console.log("Market Depth:", orderbook.getMarketDepth());
};

seedOrderbook();
