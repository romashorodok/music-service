package shaka

import (
	"fmt"
	"log"
	"os/exec"
)

type ShakaInput struct {
	InPipe    string
	FileName  string /* With Muxer */
	Directory string
}

type Shaka struct {
	Workdir  string
	Manifest string

	Items []*ShakaInput
}

func initialSegment(outputPath, filename string) string {
	return fmt.Sprintf("init_segment=%s/0-%s", outputPath, filename)
}

func segmentTemplate(outputPath, filename string) string {
	return fmt.Sprintf("segment_template=%s/$Number$-%s", outputPath, filename)
}

func input(inPipe, outputPath, filename string) string {

	initial := initialSegment(outputPath, filename)
	template := segmentTemplate(outputPath, filename)

	return fmt.Sprintf("in=%s,stream=audio,%s,%s", inPipe, initial, template)
}

func (s *Shaka) NewProcess() *exec.Cmd {
	cmd := exec.Command("packager")

	for _, item := range s.Items {

		in := input(
			item.InPipe,
			item.Directory,
			item.FileName,
		)

		cmd.Args = append(cmd.Args, in)
	}

	cmd.Args = append(cmd.Args, "--generate_static_live_mpd")
	cmd.Args = append(cmd.Args, "--mpd_output", fmt.Sprintf("%s/%s", s.Workdir, s.Manifest))
	cmd.Args = append(cmd.Args, "--segment_duration", "4")
	cmd.Args = append(cmd.Args, "--min_buffer_time", "4")

	log.Println("Command for shaka", cmd.Args)

	return cmd
}

func (s *Shaka) Run() error {
	process := s.NewProcess()

	if err := process.Run(); err != nil {
		log.Printf("Something went wrong on shaka process for %s", s.Manifest)
		return err
	}

	return nil
}
