FROM node:20-alpine

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install --frozen-lockfile

RUN pnpm --filter db exec prisma generate
RUN pnpm --filter web build

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]