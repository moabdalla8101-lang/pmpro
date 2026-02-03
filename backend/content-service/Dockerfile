FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared package
COPY ../shared ./shared

# Copy content service
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Build shared package
WORKDIR /app/shared
RUN npm install && npm run build

# Build content service
WORKDIR /app
RUN npm install && npm run build

FROM node:20-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Install production dependencies
RUN npm install --production

EXPOSE 3002

CMD ["node", "dist/index.js"]



