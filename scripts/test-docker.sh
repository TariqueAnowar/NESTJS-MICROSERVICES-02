#!/bin/bash

# Test script for Docker setup
set -e

echo "🐳 Testing Docker setup for NestJS Microservices"
echo "================================================"

# Build and start services
echo "📦 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Test Products Service health
echo "🔍 Testing Products Service health..."
if curl -f http://localhost:3001/health; then
    echo "✅ Products Service is healthy"
else
    echo "❌ Products Service health check failed"
    docker-compose logs products
    exit 1
fi

# Test API Gateway health
echo "🔍 Testing API Gateway health..."
if curl -f http://localhost:3000/api/health; then
    echo "✅ API Gateway is healthy"
else
    echo "❌ API Gateway health check failed"
    docker-compose logs api-gateway
    exit 1
fi

# Test basic endpoints
echo "🔍 Testing basic endpoints..."
echo "Products Service:"
curl -s http://localhost:3001/ | jq .

echo "API Gateway:"
curl -s http://localhost:3000/api/ | jq .

echo "🎉 All tests passed!"
echo "📊 Service status:"
docker-compose ps

echo ""
echo "🛑 To stop services, run: docker-compose down"
echo "📋 To view logs, run: docker-compose logs -f" 