#!/bin/bash

# OpenGov Voting Tool - Test Frontend Installation and Run Script
# This script installs dependencies and runs the test frontend

echo "🗳️  OpenGov Voting Tool - Test Frontend Setup"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if backend is running
echo "🔍 Checking if backend is running on port 3000..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is running and healthy"
else
    echo "⚠️  Backend is not running on port 3000"
    echo "   Please start the backend first:"
    echo "   cd ../backend && npm run build && npm start"
    echo ""
    echo "   Or continue anyway if you want to test the frontend without data."
    read -p "   Continue without backend? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🚀 Starting test frontend..."
echo "   Frontend will be available at: http://localhost:8080"
echo "   Backend API (if running): http://localhost:3000"
echo ""
echo "⚠️  Remember: This is a TESTING frontend for SQLite migration validation"
echo "   It will be replaced by the Polkassembly overlay later."
echo ""

# Start the development server
npm run dev 