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

RUN apk --no-cache add ca-certificates nginx

WORKDIR /app

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy backend binary from backend-builder
COPY --from=backend-builder /app/backend/server /app/server

# Create a startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'nginx -g "daemon off;" &' >> /app/start.sh && \
    echo 'exec /app/server' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 80 8080

# Health check (install wget first)
RUN apk add --no-cache wget

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/attendees/count || exit 1

# Start both nginx and backend server
CMD ["/app/start.sh"]

