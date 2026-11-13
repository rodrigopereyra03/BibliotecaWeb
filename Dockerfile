# ==========================================
# Multi-stage Dockerfile for Monolith
# (React Frontend + Go Backend + PostgreSQL / SQLite)
# ==========================================

# 1. Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2. Build Go Monolith Server
FROM golang:1.24-alpine AS backend-builder
WORKDIR /app
RUN apk add --no-cache git ca-certificates
COPY backend/go.mod backend/go.sum ./backend/
WORKDIR /app/backend
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server main.go

# 3. Final Production Runner
FROM alpine:3.21
WORKDIR /app
RUN apk --no-cache add ca-certificates tzdata

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Copy compiled Go binary
COPY --from=backend-builder /app/server /app/server

# Default port
ENV PORT=8080
EXPOSE 8080

CMD ["/app/server"]
