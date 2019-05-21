#/bin/sh
youtube-dl --no-playlist -x -o '%(title)s.%(ext)s' --audio-format mp3 $1 --exec "ffmpeg -ss $2 -t 15 -i {} -acodec copy 2{}; mv -f 2{} {}"
