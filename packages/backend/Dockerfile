FROM node:20-alpine
WORKDIR /app
COPY packages/backend/package*.json ./
RUN npm ci --omit=dev && npm audit --audit-level=high
COPY packages/backend/ ./
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
