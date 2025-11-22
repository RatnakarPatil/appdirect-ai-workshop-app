.PHONY: help install test test-backend test-frontend build run dev clean docker-build docker-up docker-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: install-backend install-frontend ## Install all dependencies

install-backend: ## Install backend dependencies
	cd backend && go mod download

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests
	cd backend && go test -v ./...

test-backend-coverage: ## Run backend tests with coverage
	cd backend && go test -v -coverprofile=coverage.out ./... && go tool cover -html=coverage.out -o coverage.html

test-frontend: ## Run frontend tests
	cd frontend && npm run test

test-frontend-watch: ## Run frontend tests in watch mode
	cd frontend && npm run test -- --watch

build: build-backend build-frontend ## Build both backend and frontend

build-backend: ## Build backend binary
	cd backend && go build -o ../bin/server ./cmd/server

build-frontend: ## Build frontend for production
	cd frontend && npm run build

run: ## Run both backend and frontend (requires two terminals)
	@echo "Starting backend and frontend..."
	@echo "Backend: http://localhost:8080"
	@echo "Frontend: http://localhost:5173"
	@echo "Use 'make run-backend' and 'make run-frontend' in separate terminals"

run-backend: ## Run backend server
	cd backend && go run cmd/server/main.go

run-frontend: ## Run frontend dev server
	cd frontend && npm run dev

dev: run ## Alias for run

clean: ## Clean build artifacts
	rm -rf bin/
	rm -rf frontend/dist/
	rm -rf frontend/node_modules/.vite/
	rm -rf backend/coverage.out backend/coverage.html

docker-build: ## Build Docker image
	docker build -t appdirect-workshop:latest -f Dockerfile .

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-rebuild: ## Rebuild and start Docker containers
	docker-compose up --build -d

lint-backend: ## Lint backend code
	cd backend && golangci-lint run || echo "golangci-lint not installed, skipping"

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

lint: lint-backend lint-frontend ## Lint all code

fmt-backend: ## Format backend code
	cd backend && go fmt ./...

fmt-frontend: ## Format frontend code
	cd frontend && npm run lint -- --fix

fmt: fmt-backend fmt-frontend ## Format all code

