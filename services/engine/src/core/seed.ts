import { Orderbook } from "./Orderbook.js";
import { v4 as uuidv4 } from "uuid";
import { Engine } from "./Engine.js";
import dotenv from "dotenv";
dotenv.config();

const createOrderbook = (market: string) => {
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

  return new Orderbook(bids, asks, market, 1, 50000);
};

const seedOrderbooks = async() => {
  console.log("S3 BUCKET =", process.env.S3_BUCKET_NAME);

  // Create engine instance
  const engine = await Engine.create();
  Engine.instance = engine;

  // Create and add each orderbook
  const markets = [
    "ind-vs-pak-wc",
    "btc-halving-2024",
    "iphone16-launch",
    "us-pres-debate-2024",
    "eth-dencun-upgrade",
    "superbowl-lviii"
  ];

  for (const market of markets) {
    const orderbook = createOrderbook(market);
    engine.addOrderbook(orderbook);
    console.log(`=== Orderbook Seeded for ${market} ===`);
    console.log("Market Depth:", orderbook.getMarketDepth());
  }

  console.log("All orderbooks seeded successfully");
};

seedOrderbooks();
