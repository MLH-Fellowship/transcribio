import os
import ffmpeg

def processVideo(videoFileName):
    return extractAudio(videoFileName)

def extractAudio(videoFileName):
    process = (
        ffmpeg
        .input(videoFileName)
        .output('pipe:', format='s16le', acodec='pcm_s16le', ac=1, ar='16k')
        .run_async(pipe_stdout=True, pipe_stderr=True)
    )
    audioOut, err = process.communicate()
    os.remove(videoFileName)
    return speechToText(audioOut)


def speechToText(rawAudio):
    return str(type(rawAudio))