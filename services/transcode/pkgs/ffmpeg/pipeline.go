package ffmpeg

import (
	"fmt"
	"github.com/romashorodok/music-service/services/transcode/pkgs/shaka"
	"log"
	"os"
	"os/signal"
	"path"
	"sync"
	"syscall"

	"github.com/google/uuid"
)

type FFMpegProcessingPipeline struct {
	Manifest   string
	Sourcefile string
	Workdir    string
	Items      []*FFMpeg
}

var signals = make(chan os.Signal, 1)

func (s *FFMpegProcessingPipeline) Run() (err error) {
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-signals
		os.RemoveAll(s.Workdir)
		log.Printf("Termination signal received. Cleen up transcode resources. For:\n %s", s.Workdir)
	}()

	var wg sync.WaitGroup
	wg.Add(1)

	for _, ffmpeg := range s.Items {
		if err = ffmpeg.NewPipe(s.Workdir); err != nil {
			log.Printf("Cannot prepare pipe for %s", s.Sourcefile)
			return
		}
	}

	go func() {
		for _, ffmpeg := range s.Items {
			ffmpeg.Input = s.Sourcefile
			if err = ffmpeg.Run(); err != nil {
				log.Printf("Something goes wrong on ffmpeg process for %s", s.Sourcefile)
				return
			}
		}
	}()

	go func() {
		defer func() {
			wg.Done()
		}()

		packager := &shaka.Shaka{
			Workdir:  s.Workdir,
			Manifest: s.Manifest,
			Items:    []*shaka.ShakaInput{},
		}

		for _, ffmpeg := range s.Items {
			folder := uuid.New().String()
			directory := path.Join(s.Workdir, folder)
			filename := fmt.Sprintf("%s.%s", uuid.New(), ffmpeg.Muxer)

			packager.Items = append(packager.Items, &shaka.ShakaInput{
				InPipe:    *ffmpeg.Pipe,
				FileName:  filename,
				Directory: directory,
			})
		}

		if err = packager.Run(); err != nil {
			log.Printf("Something goes wrong on shaka process for %s", s.Manifest)
		}
	}()

	wg.Wait()

	return err
}
