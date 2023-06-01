FROM golang:1.20.4

WORKDIR /app

COPY . .

RUN go mod download

RUN CGO_ENABLED=1 GOOS=linux go build -o /bin/transcode

RUN apt-get update
RUN apt-get install -y \
        curl \
        libc-ares-dev \
        build-essential git python python3

RUN curl -L https://github.com/shaka-project/shaka-packager/releases/download/v2.6.1/packager-linux-x64 --output /usr/local/bin/packager

RUN chmod +x /usr/local/bin/packager

RUN apt-get install -y ffmpeg

CMD ["/bin/transcode"]
