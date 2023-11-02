package fragments

import "reflect"

const (
	INPUT   = "-i"
	MUXER   = "-f"
	CODEC   = "-c:a"
	BITRATE = "-b:a"
	PIPE    = "pipe:"
)

const (
	BITRATE_LOW    = "64K"
	BITRATE_NORMAL = "128K"
	BITRATE_HIGHT  = "320K"
)

const (
	MUXER_WEBM = "webm"
)

type FFMpegFragment interface {
	GetFragment() (command string, value string)
}

type NoMetadata struct{}

func (*NoMetadata) GetFragment() (string, string) {
	return "-map_metadata", "0:s:0"
}

type EchoEffect struct{}

func (*EchoEffect) GetFragment() (string, string) {
	return "-af", "highpass=f=200, lowpass=f=3000"
}

type LogLevel struct{}

func (*LogLevel) GetFragment() (string, string) {
	return "-loglevel", "warning"
}

type Verbose struct{}

func (*Verbose) GetFragment() (string, string) {
	return "-v", "verbose"
}

func ContainFragment(fragments *[]FFMpegFragment, fragment interface{}) bool {
	implType := reflect.TypeOf(fragment)

	for _, frag := range *fragments {
		fragType := reflect.TypeOf(frag)

		if fragType == implType {
			return true
		}
	}

	return false
}
