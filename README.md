# Opinion Trading Platform

A full-stack, microservices-based opinion trading platform built with TypeScript, Redis/BullMQ, PostgreSQL/Prisma, WebSockets, and Docker.

---

## Architecture

![Architecture](https://res.cloudinary.com/dutbrfinr/image/upload/v1746031007/im1z4fhaqieu71g1cr3b.png)

---

## 🧰 Tech Stack

- **Language & Runtime**: Node.js 20, TypeScript  
- **Package Manager**: pnpm  
- **Services & Frameworks**  
  - **API Server** (`apps/server`): Express, Prisma ORM  
  - **WebSocket Server** (`services/wss`): WebSockets + Redis Pub/Sub  
  - **Engine** (`services/engine`): In-memory orderbook, matching logic  
  - **Worker & Queues** (`packages/order-queue`): BullMQ, Redis  
  - **Archiver** (`services/archiver`): Persists trades/positions to PostgreSQL  
  - **Frontend** (`apps/client`): Next.js, React
- **Database**: PostgreSQL (via Prisma)  
- **Cache**: Redis (Pub/Sub + BullMQ)  
- **Containerization**: Docker, Docker Compose  

---

