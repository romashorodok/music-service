package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/romashorodok/music-service/services/transcode/pkgs/consumer"
	"github.com/romashorodok/music-service/services/transcode/pkgs/storage"
	"github.com/romashorodok/music-service/services/transcode/transcoder"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

const (
	TRANSCODE_AUDIO_TOPIC = "transcode-audio-topic"
)

type TranscodeAudioTopic struct {
	BucketId         uint32 `json:"bucket_id"`
	AudioFile        string `json:"audio_file"`
	AudioFileBucket  string `json:"audio_file_bucket"`
	ProcessingBucket string `json:"processing_bucket"`
	SegmentBucket    string `json:"segment_bucket"`
}

var signals = make(chan os.Signal, 1)

type TranscodeAudio struct {
	KAFKA_HOST *string

	MINIO_HOST     *string
	MINIO_USER     *string
	MINIO_PASSWORD *string

	TRANSCODE_CALLBACK *string
	Ctx                context.Context
}

func (t TranscodeAudio) TopicProcessingWorkerPool(topicChan <-chan *consumer.Box[*TranscodeAudioTopic], numWorkers int) {
	var wg sync.WaitGroup
	wg.Add(numWorkers)

	producer, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": *t.KAFKA_HOST})

	if err != nil {
		log.Panic(err)
	}

	defer producer.Close()

	go func() {
		for e := range producer.Events() {
			switch ev := e.(type) {
			case *kafka.Message:
				if ev.TopicPartition.Error != nil {
					log.Printf("Delivery failed: %v\n", ev.TopicPartition)
				} else {
					log.Printf("Delivered message to %v\n", ev.TopicPartition)
				}
			}
		}
	}()

	transcodesvc := transcoder.NewTranscoderService(
		&t.Ctx,
		&storage.MinioCredentials{
			User:     *t.MINIO_USER,
			Password: *t.MINIO_PASSWORD,
			Endpoint: *t.MINIO_HOST,
		},
		producer,
	)

	transcodesvc.TRANSCODE_CALLBACK = *t.TRANSCODE_CALLBACK

	workerPool := make(chan struct{}, numWorkers)
	for i := 0; i < numWorkers; i++ {
		workerPool <- struct{}{}
	}

	for {
		log.Println("Worker iteration")

		select {
		case <-t.Ctx.Done():
			wg.Wait()
			return
		case msg := <-topicChan:
			<-workerPool

			go func(msg *consumer.Box[*TranscodeAudioTopic]) {
				defer func() {
					workerPool <- struct{}{}
					wg.Done()
					wg.Add(1)
				}()
				log.Printf("Processing message to topic %s [%d] at offset %v\n",
					*msg.Message.TopicPartition.Topic, msg.Message.TopicPartition.Partition, msg.Message.TopicPartition.Offset)

				if err != nil {
					return
				}

				if err := transcodesvc.TranscodeAudio(&transcoder.TranscodeData{
					BucketId:         msg.Data.BucketId,
					AudioFile:        msg.Data.AudioFile,
					AudioFileBucket:  msg.Data.AudioFileBucket,
					ProcessingBucket: msg.Data.ProcessingBucket,
					SegmentBucket:    msg.Data.SegmentBucket,
				}); err != nil {
					log.Println(err)
				}

				log.Printf("End pocessing message to topic %s [%d] at offset %v\n",
					*msg.Message.TopicPartition.Topic, msg.Message.TopicPartition.Partition, msg.Message.TopicPartition.Offset)
			}(msg)

		}
	}
}

func env(key, defaultValue string) *string {
	if variable := os.Getenv(key); variable != "" {
		return &variable
	}

	return &defaultValue
}

func main() {

	KAFKA_HOST := env("KAFKA_BROKERS", "localhost:9092")

	var config = &kafka.ConfigMap{
		"bootstrap.servers":    *KAFKA_HOST,
		"group.id":             "upload-consumers",
		"auto.offset.reset":    "earliest",
		"max.poll.interval.ms": 8000,
		"session.timeout.ms":   6000,
		"enable.auto.commit":   false,
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	transcoder := &TranscodeAudio{
		KAFKA_HOST: KAFKA_HOST,

		MINIO_HOST:     env("MINIO_HOST", "localhost:9000"),
		MINIO_USER:     env("MINIO_USER", "minioadmin"),
		MINIO_PASSWORD: env("MINIO_PASSWORD", "minioadmin"),

		TRANSCODE_CALLBACK: env("TRANSCODE_CALLBACK", "http://localhost:8000/api/transcode"),
		Ctx:                ctx,
	}

	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	containerChan := make(chan *consumer.Box[*TranscodeAudioTopic])
	go consumer.ConsumeTopic(config, TRANSCODE_AUDIO_TOPIC, containerChan)
	go transcoder.TopicProcessingWorkerPool(containerChan, 1)

	select {
	case <-signals:
		log.Println("Termination signal received")
	case <-ctx.Done():
		log.Println("Context cancelled")
	}
}
