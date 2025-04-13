FROM node:20

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/db exec prisma generate
RUN pnpm --filter @repo/server... build

WORKDIR /app/apps/server

# Ensure environment variables are available at runtime
ENV REDIS_HOST=probo-redis
ENV REDIS_PORT=6379
ENV REDIS_URL=redis://probo-redis:6379

CMD ["pnpm", "start"]
