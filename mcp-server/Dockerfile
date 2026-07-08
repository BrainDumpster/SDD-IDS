# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

COPY mcp-server/package.json mcp-server/package-lock.json* ./
RUN npm ci

COPY mcp-server/tsconfig.json mcp-server/server.ts ./
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S mcp && adduser -S mcp -G mcp

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER mcp

EXPOSE 3000

CMD ["node", "dist/server.js"]
