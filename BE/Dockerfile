# BE Dockerfile: build context will be project root so we can copy DATA
FROM node:18-alpine

WORKDIR /app

# Copy package files from BE folder
COPY BE/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy server and data
COPY BE/server.js ./
COPY DATA ./DATA

EXPOSE 3333

CMD ["node", "server.js"]
