# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first ,better layer caching
COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript to JavaScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app
RUN apk add --no-cache stockfish --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci 

# Copy the compiled output from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/App.js"]
