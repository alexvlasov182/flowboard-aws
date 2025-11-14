FROM golang:1.25 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Static build
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o backend cmd/main.go

# Используем distroless без libc зависимостей
FROM gcr.io/distroless/base-debian11
WORKDIR /app
COPY --from=builder /app/backend .
COPY .env .
EXPOSE 8080
CMD ["./backend"]
