@echo off
echo 🐳 Testing Docker setup for NestJS Microservices
echo ================================================

echo 📦 Building and starting services...
docker-compose up -d --build

echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak > nul

echo 🔍 Testing Products Service health...
curl -f http://localhost:3001/health
if %errorlevel% equ 0 (
    echo ✅ Products Service is healthy
) else (
    echo ❌ Products Service health check failed
    docker-compose logs products
    exit /b 1
)

echo 🔍 Testing API Gateway health...
curl -f http://localhost:3000/api/health
if %errorlevel% equ 0 (
    echo ✅ API Gateway is healthy
) else (
    echo ❌ API Gateway health check failed
    docker-compose logs api-gateway
    exit /b 1
)

echo 🔍 Testing basic endpoints...
echo Products Service:
curl -s http://localhost:3001/

echo API Gateway:
curl -s http://localhost:3000/api/

echo 🎉 All tests passed!
echo 📊 Service status:
docker-compose ps

echo.
echo 🛑 To stop services, run: docker-compose down
echo 📋 To view logs, run: docker-compose logs -f