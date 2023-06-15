package consumer

import (
	"encoding/json"
	"log"
	"reflect"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

type Box[F interface{}] struct {
	Consumer *kafka.Consumer
	Message  kafka.Message
	Data     F
}

func NewConsumerContainer[F any]() *Box[F] {
	return &Box[F]{}
}

func pushMessage[F any](consumer *kafka.Consumer, message *kafka.Message, out chan<- *Box[F]) error {
	container := NewConsumerContainer[F]()

	if err := json.Unmarshal(message.Value, &container.Data); err != nil {
		log.Printf("Error unmarshalling message: %v", err)
		return err
	}

	container.Message = *message
	container.Consumer = consumer

	out <- container

	log.Printf("Delivered message to topic %s [%d] at offset %v\n",
		*message.TopicPartition.Topic, message.TopicPartition.Partition, message.TopicPartition.Offset)

	return nil

}

func pollMessages[F any](c *kafka.Consumer, out chan<- *Box[F]) {
	for {

		log.Println("Consumer polling messages")

		msg := c.Poll(3000)

		switch t := msg.(type) {

		case *kafka.Message:
			_, _ = c.CommitMessage(t)
			if err := pushMessage(c, t, out); err != nil {
				log.Println("Error to push message", err)
			}

		case kafka.Error:

			switch t.Code() {

			case kafka.ErrTimedOut:
				log.Println("Timed out while waiting for message")

			case kafka.ErrTransport:
				log.Println("Connection to broker lost")

			default:
				// %4|1681132527.138|MAXPOLL|rdkafka#consumer-1| [thrd:main]: Application maximum poll interval (300000ms) exceeded by 162ms (adjust max.poll.interval.ms for long-running message processing): leaving group
				// 2023/04/10 16:15:57 Error reading message: Application maximum poll interval (300000ms) exceeded by 162ms
				log.Printf("Error reading message: %v\n", t)
			}

			time.Sleep(time.Second * 10)
			return

		case nil:
			log.Println("Noting get")

		default:
			log.Println("Something unknown pulled", reflect.TypeOf(t))
		}
	}
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

		pollMessages(c, out)

		c.Close()
	}
}
