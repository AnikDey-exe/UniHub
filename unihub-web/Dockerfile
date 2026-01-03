

# --------------------------
# Stage 1: Build the app
# --------------------------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app
    
# Copy package.json and package-lock.json first (for caching)
COPY package.json package-lock.json* ./
    
# Install all dependencies
RUN npm ci
    
# Copy the rest of the app (including src/)
COPY . .
    
# Build the Next.js app
RUN npm run build
    
    # --------------------------
    # Stage 2: Production image
    # --------------------------
FROM node:22-alpine AS runner
    
WORKDIR /app
    
# Copy only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
    
# Copy the built app and necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/src ./src
    
    # --------------------------
    # Environment variables
    # --------------------------
    # Load runtime env variables from .env.production
    # Do NOT include secrets in the image; pass them at runtime
ENV NODE_ENV=production
ENV PORT=3000
    
# Expose the port
EXPOSE 3000
    
# Run the app using SSR (next start)
CMD ["npm", "start"]
    
