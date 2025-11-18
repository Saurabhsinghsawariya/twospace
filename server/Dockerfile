# server/Dockerfile

# 1. Use Node 18 Alpine (Lightweight)
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (Optimizes cache)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Build TypeScript
RUN npm run build

# 7. Expose the port
EXPOSE 8000

# 8. Start command
CMD ["npm", "start"]