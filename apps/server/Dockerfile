FROM node:16-alpine AS builder
RUN apk update
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm --package=turbo dlx turbo prune --scope=@nql/server --docker

FROM node:16-alpine AS installer
RUN apk update
RUN corepack enable
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/apps/server/prisma ./prisma
RUN pnpm install


FROM node:16-alpine AS sourcer
RUN corepack enable
WORKDIR /app
COPY --from=builder /app/out/full/ .
COPY --from=installer /app/ .
RUN pnpm generate
RUN pnpm dlx turbo run build --scope=@nql/server --include-dependencies --no-deps
CMD [ "node", "apps/server/dist/main.js" ]

