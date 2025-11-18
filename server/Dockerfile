# server/Dockerfile

# 1. Use Node 20 Alpine (Lightweight)
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (Optimizes cache)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. FIX: Grant execution permission to the tsc binary
# The issue was using $(npm bin). We use the direct path: node_modules/.bin/tsc
# This resolves the 'Permission denied' error during the build phase.
RUN chmod +x ./node_modules/.bin/tsc

# 7. Build TypeScript
RUN npm run build

# 8. Expose the port
EXPOSE 8000

# 9. Start command
CMD ["npm", "start"]