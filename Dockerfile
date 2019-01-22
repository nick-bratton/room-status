FROM node:10-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn
CMD yarn run serve --port $PORT --mode production

# FROM node:10-alpine
# WORKDIR /app
# COPY --from=builder /app/dist /app
# RUN yarn add global http-server
# CMD npx http-server -p $PORT -A 0.0.0.0