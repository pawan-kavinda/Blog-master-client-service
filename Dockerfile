# ---- Stage 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --verbose

COPY . .
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Install serve globally for static file serving
RUN npm install -g serve

# Copy build output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
