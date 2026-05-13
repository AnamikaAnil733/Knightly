# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production stage (using Nginx)
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
