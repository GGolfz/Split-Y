###################
# BACKEND BUILD
###################
FROM oven/bun AS backend-build

WORKDIR /usr/src/app

COPY ./server/package.json ./
COPY ./server/bun.lockb ./

RUN bun install --production

COPY ./server/src src
COPY ./server/prisma prisma
COPY ./server/tsconfig.json ./
ENV NODE_ENV production

###################
# FRONTEND BUILD
###################
FROM node:18-alpine As frontend-build 
ENV ci=true
RUN npm i -g pnpm@7
WORKDIR /usr/src/app
COPY --chown=node:node ./client/pnpm-lock.yaml ./
RUN pnpm fetch --prod

COPY --chown=node:node ./client ./
RUN pnpm install
RUN pnpm build 
###################
# PRODUCTION
###################
FROM oven/bun AS production
WORKDIR /app
ENV NODE_ENV production

COPY --from=backend-build /usr/src/app/node_modules ./node_modules
COPY --from=backend-build /usr/src/app ./
COPY --from=frontend-build /usr/src/app/dist ./public

CMD ["bun", "src/index.ts"]