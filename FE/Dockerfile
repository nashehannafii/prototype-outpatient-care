# FE Dockerfile: multi-stage build (builder -> nginx)
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY FE/package*.json ./
RUN npm ci

# Copy full FE app and build
COPY FE/ ./
ARG VITE_MAIN_URL
ENV VITE_MAIN_URL=${VITE_MAIN_URL}
RUN npm run build

# Production image
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: expose on 80 and run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
