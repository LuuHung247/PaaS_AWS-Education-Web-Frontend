# EduConnect Platform

This is the frontend application for the EduConnect education and connection platform, built with React and Vite.

## Table of Contents

- [Quick Start](#quick-start)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Development Commands](#development-commands)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Development Environment

#### Prerequisites

- Node.js v16+ (v22 recommended)
- npm or yarn
- Docker (for containerization)

#### Setup Environment Variables

1. Create a `.env` file in the root directory of the project:

```bash
cp .env.example .env  # If .env.example exists, otherwise create manually
```

2. Configure the following environment variables in your `.env` file:

```
VITE_AWS_REGION=ap-southeast-1
VITE_AWS_USER_POOL_ID=your-user-pool-id
VITE_AWS_USER_POOL_CLIENT_ID=your-user-pool-client-id
VITE_BACKEND_URL=http://localhost:3000
```

#### Running the Application Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

The application will be available at [http://localhost:5173](http://localhost:5173).

## Docker Deployment

### Using the Build Script

1. Make sure the build script is executable:

```bash
chmod +x buildimage.sh
```

2. Run the build script to create a Docker image:

```bash
./buildimage.sh
```

3. Run the Docker container:

```bash
docker run -d -p 80:80 --name educonnect-app educonnect-app
```

### Checking if the Container is Running

```bash
docker ps | grep educonnect-app
```

### Viewing Container Logs

```bash
docker logs educonnect-app
```

### Stopping and Removing the Container

```bash
# Stop the container
docker stop educonnect-app

# Remove the container
docker rm educonnect-app
```

## Features

- **Authentication**: User registration, login, password reset
- **Profile Management**: View and edit user profile
- **User Search**: Find other students and teachers
- **Messaging**: Real-time chat between users
- **Dashboard**: Overview of activities and information

## Technologies Used

- React (with Vite)
- AWS Cognito for authentication
- Tailwind CSS for styling
- Nginx for serving the application

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

The project follows a structured organization:

```
src/
  ├── assets/          # Static assets (images, icons)
  ├── components/      # Reusable UI components
  │   ├── auth/        # Authentication related components
  │   ├── common/      # Shared UI elements
  │   ├── explore/     # Explore page components
  │   ├── layout/      # Layout components (Header, Footer)
  │   ├── lessons/     # Lesson related components
  │   ├── profile/     # User profile components
  │   └── series/      # Series/course components
  ├── config/          # Configuration files
  ├── context/         # React context providers
  ├── hooks/           # Custom React hooks
  ├── pages/           # Page components
  ├── services/        # API and service integrations
  └── styles/          # CSS and style files
```

## Troubleshooting

### Common Docker Issues

1. **Environment Variables Missing**: Make sure all required environment variables are passed to the Docker build.

2. **Nginx Configuration**: If the application shows a default Nginx page instead of the React app, check that:
   - The `nginx.conf` file exists in your project root
   - The build process completed successfully
   - The Dockerfile correctly copies files from the build stage

3. **Docker Build Errors**: Common issues include:
   - Missing `.env` file or nginx.conf - fixed by the approach in the Dockerfile
   - Network timeouts during npm install - try again or use a different network
   - Insufficient memory during build - increase Docker's resource allocation

4. **AWS Cognito Connection Issues**: Check if the correct AWS region and pool IDs are configured.

docker build   --build-arg VITE_BACKEND_URL=https://ecom-devops.online/api/v1   --build-arg VITE_AWS_REGION=ap-southeast-1   --build-arg VITE_AWS_USER_POOL_ID=ap-southeast-1_XhsLUhFqv   --build-arg VITE_AWS_USER_POOL_CLIENT_ID=4pp6k4om5klflugd46q7kvl7t7   -t hunglk247/educonnect-frontend:k8s-v3   .