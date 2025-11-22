# Multi-stage Dockerfile for building both frontend and backend into one image

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
# Use npm install instead of npm ci to handle missing lock file gracefully
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY frontend/ .

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app/backend

# Install build dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY backend/go.mod backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source
COPY backend/ .

# Build backend binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./cmd/server

# Stage 3: Final Runtime Image
FROM alpine:latest

# Install nginx with envsubst support for template processing
RUN apk --no-cache add ca-certificates nginx gettext

WORKDIR /app

# Copy nginx configuration template
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy backend binary from backend-builder
COPY --from=backend-builder /app/backend/server /app/server

# Enable nginx envsubst for template processing
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d

# Create a startup script that:
# 1. Starts backend on internal port 8081
# 2. Processes nginx template with PORT env var
# 3. Starts nginx on PORT (Cloud Run requirement - receives all traffic)
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'export BACKEND_PORT=8081' >> /app/start.sh && \
    echo 'export PORT=${PORT:-8080}' >> /app/start.sh && \
    echo 'echo "Starting backend on port $BACKEND_PORT..."' >> /app/start.sh && \
    echo 'PORT=$BACKEND_PORT /app/server &' >> /app/start.sh && \
    echo 'sleep 2' >> /app/start.sh && \
    echo 'echo "Starting nginx on port $PORT..."' >> /app/start.sh && \
    echo 'exec nginx -g "daemon off;"' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 80 8080

# Health check (install wget first)
RUN apk add --no-cache wget

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/api/attendees/count || exit 1

# Start both nginx and backend server
CMD ["/app/start.sh"]

