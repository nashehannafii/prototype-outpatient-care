# BE Dockerfile: build context will be project root so we can copy DATA
FROM node:18-alpine

# Keep BE files under /app/BE so __dirname in server.js points to /app/BE
WORKDIR /app/BE

# Copy BE package files and install production deps
COPY BE/package*.json ./
RUN npm ci --only=production

# Copy BE source files into /app/BE
COPY BE/ ./

# Copy DATA to /app/DATA so server can access it via ../DATA from /app/BE
COPY DATA /app/DATA

EXPOSE 3333

CMD ["node", "server.js"]
