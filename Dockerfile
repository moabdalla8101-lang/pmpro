FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build:production

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app /app

EXPOSE 3001

CMD ["npm", "run", "start:production"]
