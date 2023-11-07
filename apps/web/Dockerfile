FROM node:16-alpine AS builder
RUN apk update
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm --package=turbo dlx turbo prune --scope=@nql/web --docker
# See https://github.com/vercel/turborepo/issues/1997#issuecomment-1271372326
RUN rm -rf /app/out/full/*/*/node_modules

# Add lockfile and package.json's of isolated subworkspace
FROM node:16-alpine AS installer
RUN apk update
RUN corepack enable
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project
COPY turbo.json turbo.json
COPY --from=builder /app/out/full/ .
RUN pnpm dlx turbo run build --scope=@nql/web --include-dependencies --no-deps

FROM node:16-alpine AS runner
WORKDIR /app

RUN apk add --no-cache bash

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/scripts/entrypoint.sh ./apps/web/scripts/entrypoint.sh
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.env.production ./apps/web/.env.production

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN ["chmod", "+x", "./apps/web/scripts/entrypoint.sh"]
ENTRYPOINT [ "./apps/web/scripts/entrypoint.sh" ]

CMD ["node", "apps/web/server.js"]