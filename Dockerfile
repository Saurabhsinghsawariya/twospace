# client/Dockerfile

# 1. Use Node 20 Alpine
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
# --legacy-peer-deps helps avoid conflicts with some React libraries
RUN npm install --legacy-peer-deps

# 5. Copy source code
COPY . .

# 6. FIX: Grant execution permission to the Next.js binary
# We are replacing the error-prone $(npm bin)/next with the direct path.
# This prevents 'sh: next: Permission denied' error
RUN chmod +x ./node_modules/.bin/next

# 7. Build Next.js app
RUN npm run build

# 8. Expose port
EXPOSE 3000

# 9. Start command
CMD ["npm", "start"]