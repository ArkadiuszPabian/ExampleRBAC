FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/backend/package.json packages/backend/
RUN npm ci -w packages/backend --omit=dev && npm audit --audit-level=high
COPY packages/backend/ packages/backend/
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
EXPOSE 3000
WORKDIR /app/packages/backend
CMD ["node", "server.js"]
