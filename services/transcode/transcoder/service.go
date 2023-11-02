package transcoder

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/minio/minio-go/v7"
	ffmpeg "github.com/romashorodok/music-service/services/transcode/pkgs/ffmpeg"
	"github.com/romashorodok/music-service/services/transcode/pkgs/ffmpeg/codecs"
	"github.com/romashorodok/music-service/services/transcode/pkgs/ffmpeg/fragments"
	"github.com/romashorodok/music-service/services/transcode/pkgs/storage"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/google/uuid"
)

type TranscodeData struct {
	BucketId         uint32 `json:"bucket_id"`
	AudioFile        string `json:"audio_file"`
	AudioFileBucket  string `json:"audio_file_bucket"`
	ProcessingBucket string `json:"processing_bucket"`
	SegmentBucket    string `json:"segment_bucket"`

	ManifestFile *string `json:"manifest_file"`
}

type TranscoderService struct {
	ctx      *context.Context
	miniosvc *storage.MinioService
	creds    *storage.MinioCredentials
	producer *kafka.Producer

	TRANSCODE_CALLBACK string
}

var (
	TRANSCODED_AUDIO_TOPIC = "transcoded-audio-topic"
)

var (
	VERBOSE  = fragments.Verbose{}
	LOGLEVEL = fragments.LogLevel{}
)

func NewTranscoderService(ctx *context.Context, minioCredentials *storage.MinioCredentials, producer *kafka.Producer) *TranscoderService {
  minioPool, err := storage.NewMinioPool(4, minioCredentials)
  
	if err != nil {
		log.Panic("Cannot init minio pool clients. Error: ", err)
	}

	return &TranscoderService{
		ctx:      ctx,
		miniosvc: &storage.MinioService{Pool: minioPool},
		creds:    minioCredentials,
		producer: producer,
	}
}

func (s *TranscoderService) TranscodeAudio(t *TranscodeData) error {
	url, err := s.miniosvc.GetObjectURL(*s.ctx, t.AudioFileBucket, t.AudioFile)
	if err != nil {
		log.Println("Cannot reach input file")
		return err
	}

	dir, err := os.MkdirTemp("", fmt.Sprintf("%s-*", uuid.New()))
	if err != nil {
		log.Println("Cannot create temp dir")
	}

	defer os.RemoveAll(dir)

	parts := strings.Split(url.String(), "?")
	urlWithoutQuery := parts[0]
	manifest := fmt.Sprintf("%s.mpd", uuid.New())

	pipeline := &ffmpeg.FFMpegProcessingPipeline{
		Sourcefile: urlWithoutQuery,
		Manifest:   manifest,
		Workdir:    dir,

		Items: []*ffmpeg.FFMpeg{
			{
				Codec:     codecs.VORBIS,
				Muxer:     fragments.MUXER_WEBM,
				Bitrate:   fragments.BITRATE_LOW,
				Fragments: []fragments.FFMpegFragment{&fragments.NoMetadata{}, &fragments.EchoEffect{}, &VERBOSE, &LOGLEVEL},
			},
			{
				Codec:     codecs.VORBIS,
				Muxer:     fragments.MUXER_WEBM,
				Bitrate:   fragments.BITRATE_NORMAL,
				Fragments: []fragments.FFMpegFragment{&fragments.NoMetadata{}, &VERBOSE, &LOGLEVEL},
			},
			{
				Codec:     codecs.VORBIS,
				Muxer:     fragments.MUXER_WEBM,
				Bitrate:   fragments.BITRATE_HIGHT,
				Fragments: []fragments.FFMpegFragment{&fragments.NoMetadata{}, &VERBOSE, &LOGLEVEL},
			},
		},
	}

	if err = pipeline.Run(); err != nil {
		log.Println("Something goes wrong on pipeline", err)
		return errors.New("failed processing")
	}

	for _, ffmpeg := range pipeline.Items {
		_ = ffmpeg.DelPipe()
	}

	s.DeliverFiles(dir, t.SegmentBucket, t.ProcessingBucket)

	t.ManifestFile = &manifest
	data, err := json.Marshal(t)

	if err != nil {
		log.Println("Failed to serialize data")
		return err
	}

	err = s.OnSuccessProcessingCallCallback(bytes.NewReader(data))

	if err != nil {
		errCh := s.miniosvc.DeleteObjectsRecur(*s.ctx, t.SegmentBucket, t.ProcessingBucket)

		log.Println("Delete segments for", t.ProcessingBucket)

		if errCh != nil {
			err = errors.New("cannot delete processing folder")
		}
	}

	return err
}

func (s *TranscoderService) OnSuccessProcessingCallCallback(dataReader *bytes.Reader) error {
	client := &http.Client{}

	req, err := http.NewRequest("POST", s.TRANSCODE_CALLBACK, dataReader)

	if err != nil {
		log.Println("Unable form request", err)
		return err
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)

	if err != nil {
		log.Println("Unable do request", err)
		return err
	}

	if resp.StatusCode != 200 {
		log.Println("Catch after success callback post request", resp.Status)

		message, _ := io.ReadAll(resp.Body)

		log.Println(string(message))

		return errors.New("failed success request")
	}

	defer resp.Body.Close()

	return nil
}

type FileBox struct {
	path string
	file string
}

func (s *TranscoderService) DeliverFiles(workdir, bucket string, subBucket string) {
	clientPool := storage.AsyncMinioPool(10, s.creds)
	files := make(chan *FileBox, 20)

	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		filepath.Walk(workdir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if !info.IsDir() {
				folder := fmt.Sprintf("%s/", workdir)
				file := strings.SplitAfter(path, folder)

				wg.Add(1)
				files <- &FileBox{file: file[1], path: path}
			}

			return nil
		})

		close(files)
	}()

	go func() {
		defer wg.Done()
		for file := range files {
			go func(file *FileBox) {
				client := <-clientPool
				defer func() {
					clientPool <- client
					wg.Done()
				}()

				uploadPath := fmt.Sprintf("%s/%s", subBucket, file.file)

				_, err := client.FPutObject(*s.ctx, bucket, uploadPath, file.path, minio.PutObjectOptions{})
				if err != nil {
					log.Println(err)
					return
				}

			}(file)
		}
	}()

	wg.Wait()
}
