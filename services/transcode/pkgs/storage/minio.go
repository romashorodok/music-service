package storage

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/url"
	"time"

	"github.com/minio/minio-go/v7"
)

type ObjectStore interface {
	GetPresignURL(ctx context.Context, bucket, filename string)
}

type MinioService struct {
	Pool *MinioPool
}

func (s *MinioService) AnonymousReadonlyBucket(ctx context.Context, client *minio.Client, bucket string) error {
	version := "2012-10-17"
	effect := "Allow"
	principal := "*"
	action := "s3:GetObject"
	resource := fmt.Sprintf("arn:aws:s3:::%s/*", bucket)

	policy := map[string]interface{}{
		"Version": version,
		"Statement": []map[string]interface{}{
			{
				"Effect":    effect,
				"Principal": principal,
				"Action":    action,
				"Resource":  resource,
			},
		},
	}

	bytePolicy, err := json.Marshal(policy)

	if err != nil {
		return err
	}

	return client.SetBucketPolicy(ctx, bucket, string(bytePolicy))
}

func (s *MinioService) CreateBucketIfNotExist(ctx context.Context, client *minio.Client, bucket string) error {
	exists, error := client.BucketExists(ctx, bucket)

	if !exists {
		error = client.MakeBucket(ctx, bucket, minio.MakeBucketOptions{})
		s.AnonymousReadonlyBucket(ctx, client, bucket)
	}

	return error
}

func (s *MinioService) GetPresignURL(ctx context.Context, bucket, filename string) (*url.URL, error) {
	client := s.Pool.Client()
	defer s.Pool.Put(client)

	if err := s.CreateBucketIfNotExist(ctx, client, bucket); err != nil {
		log.Println("Cannot create bucket. Error", err)
		return nil, err
	}

	urlExparation := time.Duration(5) * time.Minute

	return client.PresignedPutObject(ctx, bucket, filename, urlExparation)
}

func (s *MinioService) GetObjectURL(ctx context.Context, bucket, filename string) (*url.URL, error) {
	client := s.Pool.Client()
	defer s.Pool.Put(client)

	urlExparation := time.Duration(5) * time.Minute

	return client.PresignedGetObject(ctx, bucket, filename, urlExparation, nil)
}

func (s *MinioService) DeleteObjectsRecur(ctx context.Context, bucket, folderPath string) <-chan minio.RemoveObjectError {
	client := s.Pool.Client()
	defer s.Pool.Put(client)

	objectsCh := make(chan minio.ObjectInfo)

	go func() {
		defer close(objectsCh)

		opts := minio.ListObjectsOptions{Prefix: folderPath, Recursive: true}

		for object := range client.ListObjects(ctx, bucket, opts) {
			objectsCh <- object
		}
	}()

	errCh := client.RemoveObjects(ctx, bucket, objectsCh, minio.RemoveObjectsOptions{})

	for err := range errCh {
		log.Println(err)
	}

	return errCh
}
