package reader

import (
	"fmt"
	"io"
)

func ChanReader(source io.ReadCloser, destination chan string) {
	defer close(destination)

	buf := make([]byte, 1024)

	for {
		n, err := source.Read(buf)

		if err != nil {
			if err != io.EOF {
				fmt.Println("Error:", err)
			}
			break
		}

		destination <- string(buf[:n])
	}
}
