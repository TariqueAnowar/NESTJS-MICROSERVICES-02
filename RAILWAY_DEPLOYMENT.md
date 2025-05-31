# Railway Deployment Guide

This guide explains how to deploy your NestJS microservices to Railway.

## Architecture

Your application consists of two microservices:

1. **Products Service** (`products-service`)

   - HTTP API on port 3001
   - gRPC server on port 50051
   - Handles product-related operations

2. **API Gateway** (`api-gateway`)
   - HTTP API on port 3000
   - Routes requests to microservices
   - Communicates with Products Service via gRPC

## Deployment Options

### Option 1: Deploy as Separate Services (Recommended)

Deploy each service as a separate Railway service for better scalability and isolation.

#### Step 1: Deploy Products Service

1. Create a new Railway project
2. Connect your GitHub repository
3. Add a new service and select your repository
4. Set the following environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   ```
5. In the service settings:
   - Set **Root Directory** to `/` (since we're using the root context)
   - Set **Dockerfile Path** to `Dockerfile.products`
   - Set **Port** to `3001`

#### Step 2: Deploy API Gateway

1. In the same Railway project, add another service
2. Connect the same repository
3. Set the following environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   PRODUCTS_SERVICE_URL=<products-service-internal-url>:50051
   ```
4. In the service settings:
   - Set **Root Directory** to `/`
   - Set **Dockerfile Path** to `Dockerfile.api-gateway`
   - Set **Port** to `3000`

**Note**: Replace `<products-service-internal-url>` with the internal URL of your products service. Railway provides internal networking between services.

### Option 2: Local Development with Docker Compose

For local development and testing:

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Environment Variables

### Products Service

- `NODE_ENV`: Set to `production`
- `PORT`: HTTP port (default: 3001)

### API Gateway

- `NODE_ENV`: Set to `production`
- `PORT`: HTTP port (default: 3000)
- `PRODUCTS_SERVICE_URL`: gRPC URL to products service

## Health Checks

Both services include health check endpoints:

- **Products Service**: `GET /health`
- **API Gateway**: `GET /health`

These endpoints return:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "service-name"
}
```

## Networking

- **External Access**: Only the API Gateway should be exposed externally
- **Internal Communication**: Products Service communicates with API Gateway via gRPC
- **Ports**:
  - API Gateway: 3000 (HTTP)
  - Products Service: 3001 (HTTP), 50051 (gRPC)

## Troubleshooting

### Build Issues

1. **Proto compilation fails**: Ensure the `proto` directory and files are included in the build context
2. **Nx build fails**: Check that all dependencies are properly installed
3. **Node modules issues**: Clear Docker cache: `docker system prune -a`

### Runtime Issues

1. **Service can't connect**: Check internal URLs and port configurations
2. **Health checks fail**: Verify the health endpoints are accessible
3. **gRPC connection issues**: Ensure the Products Service is running and accessible on port 50051

### Railway-Specific Issues

1. **Service discovery**: Use Railway's internal networking for service-to-service communication
2. **Environment variables**: Ensure all required environment variables are set
3. **Port binding**: Make sure services bind to `0.0.0.0` not just `localhost`

## Scaling

- Each service can be scaled independently on Railway
- Consider using Railway's autoscaling features for production workloads
- Monitor resource usage and adjust accordingly

## Security

- Services communicate internally via Railway's private network
- Only the API Gateway should have public endpoints
- Use environment variables for sensitive configuration
- Consider adding authentication/authorization as needed
