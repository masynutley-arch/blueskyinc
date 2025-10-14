# Use official Node.js LTS
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Bundle app source
COPY public ./public
COPY server.js ./server.js

# Run as non-root user
USER node

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
