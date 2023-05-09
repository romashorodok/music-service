package main

import (
	"context"
	"github.com/romashorodok/music-service/services/transcode/pkgs/consumer"
	"github.com/romashorodok/music-service/services/transcode/transcoder"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

const (
	KAFKA = "localhost:9092"

	TRANSCODE_AUDIO_TOPIC = "transcode-audio-topic"
)

type TranscodeAudioTopic struct {
	BucketId         uint32 `json:"bucket_id"`
	AudioFile        string `json:"audio_file"`
	AudioFileBucket  string `json:"audio_file_bucket"`
	ProcessingBucket string `json:"processing_bucket"`
	SegmentBucket    string `json:"segment_bucket"`
}

var config = &kafka.ConfigMap{
	"bootstrap.servers":  KAFKA,
	"group.id":           "upload-consumers",
	"auto.offset.reset":  "earliest",
	"session.timeout.ms": 6000,
}

var signals = make(chan os.Signal, 1)

func processTopicMessages(ctx context.Context, topicChan <-chan *consumer.Box[*TranscodeAudioTopic], numWorkers int) {
	var wg sync.WaitGroup
	wg.Add(numWorkers)

	p, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": KAFKA})

	if err != nil {
		log.Panic(err)
	}

	defer p.Close()

	go func() {
		for e := range p.Events() {
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

	transcodesvc := transcoder.NewTranscoderService(&ctx, p)

	workerPool := make(chan struct{}, numWorkers)
	for i := 0; i < numWorkers; i++ {
		workerPool <- struct{}{}
	}

	for {
		log.Println("Worker iteration")

		select {
		case <-ctx.Done():
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

				transcodesvc.TranscodeAudio(&transcoder.TranscodeData{
					BucketId:         msg.Data.BucketId,
					AudioFile:        msg.Data.AudioFile,
					AudioFileBucket:  msg.Data.AudioFileBucket,
					ProcessingBucket: msg.Data.ProcessingBucket,
					SegmentBucket:    msg.Data.SegmentBucket,
				})

				log.Printf("End pocessing message to topic %s [%d] at offset %v\n",
					*msg.Message.TopicPartition.Topic, msg.Message.TopicPartition.Partition, msg.Message.TopicPartition.Offset)
			}(msg)

		}
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	containerChan := make(chan *consumer.Box[*TranscodeAudioTopic])
	go consumer.ConsumeTopic(config, TRANSCODE_AUDIO_TOPIC, containerChan)
	go processTopicMessages(ctx, containerChan, 4)

	select {
	case <-signals:
		log.Println("Termination signal received")
	case <-ctx.Done():
		log.Println("Context cancelled")
	}
}
