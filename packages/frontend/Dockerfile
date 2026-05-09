FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY packages/frontend/package.json packages/frontend/
COPY packages/backend/package.json packages/backend/
RUN npm ci && npm audit --audit-level=high
COPY packages/frontend/ packages/frontend/
RUN npm run build -w packages/frontend -- --configuration=production

# Single-stage serve: Bundling Nginx with Angular assets ensures an immutable, 
# signed artifact. Avoids sidecar complexity (emptyDir, lifecycle ordering) 
# and ensures the image scanned in the registry is exactly what runs in K8s. 
# One image = one unit of rollback, scaling, and security provenance.
FROM nginx:alpine
COPY --from=build /app/packages/frontend/dist/example-rbac-frontend/browser /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
