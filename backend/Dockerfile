# Use the official Golang image to build the binary
FROM golang:1.21-alpine as builder
WORKDIR /app
# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./
RUN go mod download
# Copy the rest of the source code
COPY . .
# Build the application for a Linux environment
RUN CGO_ENABLED=0 GOOS=linux go build -v -o server ./cmd/server

# Use a minimal image to run the binary
FROM alpine:latest
WORKDIR /root/
# Copy the built binary from the builder stage
COPY --from=builder /app/server .
# Expose port 10000 (Render provides the PORT env var, often 10000)
EXPOSE 10000
# Command to run the executable
CMD ["./server"]
