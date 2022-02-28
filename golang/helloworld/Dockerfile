FROM golang:alpine AS builder
WORKDIR /app
COPY . /app
RUN go build -ldflags="-s -w" /app/dockerChallange.go

FROM scratch
COPY --from=builder /app/dockerChallange .
CMD ["./dockerChallange"]