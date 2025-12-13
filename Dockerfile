FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Accept build arguments for environment variables
ARG VITE_AWS_REGION
ARG VITE_AWS_USER_POOL_ID
ARG VITE_AWS_USER_POOL_CLIENT_ID
ARG VITE_BACKEND_URL
ARG VITE_AWS_CLIENT_ID
ARG VITE_AWS_CLIENT_SECRET

# Set environment variables
ENV VITE_AWS_REGION=$VITE_AWS_REGION \
  VITE_AWS_USER_POOL_ID=$VITE_AWS_USER_POOL_ID \
  VITE_AWS_USER_POOL_CLIENT_ID=$VITE_AWS_USER_POOL_CLIENT_ID \
  VITE_BACKEND_URL=$VITE_BACKEND_URL \
  VITE_AWS_CLIENT_ID=$VITE_AWS_CLIENT_ID \
  VITE_AWS_CLIENT_SECRET=$VITE_AWS_CLIENT_SECRET

# Expose Vite dev server port
EXPOSE 5173

# Run dev server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]