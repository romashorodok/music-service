package fragments

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
