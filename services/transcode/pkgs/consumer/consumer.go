package consumer

import (
	"encoding/json"
	"log"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

type Box[F interface{}] struct {
	Message kafka.Message
	Data    F
}

func NewConsumerContainer[F any]() *Box[F] {
	return &Box[F]{}
}

func ConsumeTopic[F any](config *kafka.ConfigMap, topic string, out chan<- *Box[F]) {
	for {
		log.Println("Consumer iteration")

		c, err := kafka.NewConsumer(config)
		if err != nil {
			log.Printf("Error creating consumer: %v\n", err)
			time.Sleep(20 * time.Second)
			continue
		}

		if err = c.Subscribe(topic, nil); err != nil {
			log.Printf("Error subscribing to topic: %v\n", err)
			time.Sleep(20 * time.Second)
			continue
		}

		for {
			log.Println("Consumer reader iteration")

			container := NewConsumerContainer[F]()

			msg, err := c.ReadMessage(100 * time.Millisecond)

			if err != nil {
				switch e := err.(type) {
				case kafka.Error:
					switch e.Code() {
					case kafka.ErrTimedOut:
						log.Println("Timed out while waiting for message")

					case kafka.ErrTransport:
						log.Println("Connection to broker lost")

					default:
						// %4|1681132527.138|MAXPOLL|rdkafka#consumer-1| [thrd:main]: Application maximum poll interval (300000ms) exceeded by 162ms (adjust max.poll.interval.ms for long-running message processing): leaving group
						// 2023/04/10 16:15:57 Error reading message: Application maximum poll interval (300000ms) exceeded by 162ms
						// NOTE: if consume it loong time, if somehow handle it, if do that may escape one for loop
						log.Printf("Error reading message: %v\n", err)
					}
				default:
					log.Printf("Error reading message: %v\n", err)
				}

				time.Sleep(time.Second * 10)
				continue
			}

			if err = json.Unmarshal(msg.Value, &container.Data); err != nil {
				// TODO: When process failed, topic must be published back
				log.Printf("Error unmarshalling message: %v", err)
				continue
			}

			container.Message = *msg

			log.Printf("Delivered message to topic %s [%d] at offset %v\n",
				*msg.TopicPartition.Topic, msg.TopicPartition.Partition, msg.TopicPartition.Offset)

			// FIX: when chan has 1 size it read 1 topic but if chan is full it wait until can write topic into chan

			out <- container
		}
	}
}
