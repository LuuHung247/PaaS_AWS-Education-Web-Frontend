# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Accept build arguments for environment variables
ARG VITE_AWS_REGION
ARG VITE_AWS_USER_POOL_ID
ARG VITE_AWS_USER_POOL_CLIENT_ID
ARG VITE_BACKEND_URL
ARG VITE_AWS_CLIENT_ID
ARG VITE_AWS_CLIENT_SECRET
ARG VITE_TRACKING_URL
# Set environment variables for Vite build
ENV VITE_AWS_REGION=$VITE_AWS_REGION \
  VITE_AWS_USER_POOL_ID=$VITE_AWS_USER_POOL_ID \
  VITE_AWS_USER_POOL_CLIENT_ID=$VITE_AWS_USER_POOL_CLIENT_ID \
  VITE_BACKEND_URL=$VITE_BACKEND_URL \
  VITE_AWS_CLIENT_ID=$VITE_AWS_CLIENT_ID \
  VITE_AWS_CLIENT_SECRET=$VITE_AWS_CLIENT_SECRET \
  VITE_TRACKING_URL=$VITE_TRACKING_URL
# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
