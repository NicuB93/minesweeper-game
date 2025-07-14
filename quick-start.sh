#!/bin/bash

# Minesweeper Game - Quick Start Script
# This script automates the setup process for the minesweeper game

set -e  # Exit on any error

echo "🎮 Minesweeper Game - Quick Start Setup"
echo "======================================"

# Check if we're in the right directory
if [ ! -d "minesweeper-be" ] || [ ! -d "minesweeper-fe" ]; then
    echo "❌ Error: Please run this script from the minesweeper-game root directory"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo ""
echo "📦 Setting up Backend..."
echo "========================"

cd minesweeper-be

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. You can modify it if needed."
fi

# Start PostgreSQL database
echo "Starting PostgreSQL database..."
docker-compose up -d

# Wait a moment for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Generate Prisma client and run migrations
echo "Setting up database..."
npx prisma generate
npx prisma migrate dev --name init

echo "✅ Backend setup complete!"

echo ""
echo "🎨 Setting up Frontend..."
echo "========================="

cd ../minesweeper-fe

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    echo "VITE_BACKEND_URL=http://localhost:3000" > .env
    echo "✅ Created frontend .env file."
fi

echo "✅ Frontend setup complete!"

echo ""
echo "🚀 Starting the Application..."
echo "=============================="

# Start backend in background
echo "Starting backend server..."
cd ../minesweeper-be
npm run start:dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../minesweeper-fe
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Your Minesweeper game is now running:"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3000"
echo "📊 Database: PostgreSQL running in Docker"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap 'echo ""; echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ Servers stopped. Goodbye!"; exit' INT

# Keep script running
wait
