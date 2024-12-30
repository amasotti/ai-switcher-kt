#!/bin/bash

# Check if required environment variables are set
check_env_vars() {
    local missing=0
    if [ -z "$DEEPSEEK_API_KEY" ]; then
        echo "Error: DEEPSEEK_API_KEY is not set"
        missing=1
    fi
    if [ -z "$OPENAI_API_KEY" ]; then
        echo "Error: OPENAI_API_KEY is not set"
        missing=1
    fi
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo "Error: ANTHROPIC_API_KEY is not set"
        missing=1
    fi

    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Start the backend
start_backend() {
    echo "Starting backend..."
    ./gradlew clean build bootRun &
    BACKEND_PID=$!
}

# Start the frontend
start_frontend() {
    echo "Starting frontend..."
    cd frontend && pnpm run dev &
    FRONTEND_PID=$!
}

# Handle cleanup on script termination
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    echo "Backend stopped"
    kill $FRONTEND_PID 2>/dev/null
    echo "Frontend stopped"
    exit 0
}

# Main execution
check_env_vars
trap cleanup SIGTERM SIGINT

start_backend
start_frontend

# Keep script running and wait for interrupt
wait
