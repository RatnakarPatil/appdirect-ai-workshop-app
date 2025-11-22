# Testing Guide

## Running Tests

### Backend Tests

```bash
# Run all backend tests
make test-backend

# Run with coverage
make test-backend-coverage

# Or manually
cd backend
go test -v ./...
```

### Frontend Tests

```bash
# Run all frontend tests
make test-frontend

# Run in watch mode
make test-frontend-watch

# Or manually
cd frontend
npm run test
```

### All Tests

```bash
make test
```

## Test Coverage

### Backend Coverage

```bash
cd backend
go test -v -coverprofile=coverage.out ./...
go tool cover -html=coverage.out -o coverage.html
```

Open `coverage.html` in a browser to view coverage report.

### Frontend Coverage

```bash
cd frontend
npm run test:coverage
```

## Test Structure

### Backend Tests

- `backend/internal/handlers/*_test.go` - Handler unit tests
- `backend/internal/middleware/*_test.go` - Middleware tests

### Frontend Tests

- `frontend/src/components/__tests__/*.test.tsx` - Component tests
- `frontend/src/services/__tests__/*.test.ts` - API service tests

## Writing New Tests

### Backend Test Example

```go
func TestHandler_Method(t *testing.T) {
    gin.SetMode(gin.TestMode)
    
    handler := NewHandler(service)
    router := gin.New()
    router.GET("/endpoint", handler.Method)
    
    req, _ := http.NewRequest("GET", "/endpoint", nil)
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
}
```

### Frontend Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Component from '../Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('Text')).toBeInTheDocument()
  })
})
```

