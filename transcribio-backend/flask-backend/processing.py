import os
import ffmpeg
from google.cloud import speech


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
    client = speech.SpeechClient()
    audio = speech.RecognitionAudio(content=rawAudio)
    config = speech.RecognitionConfig(
		encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
		sample_rate_hertz=16000,
		language_code="en-US",
		enable_word_time_offsets=True,
	)

	# Detects speech in the audio file
    response = client.recognize(request={"config": config, "audio": audio})
    transcriptionResults = {}
    transcriptionResults['transcript'] = ""
    words = {}
    
    for result in response.results:
        alternative = result.alternatives[0]
        transcriptionResults['transcript'] += alternative.transcript
        for word_info in alternative.words:
            word = word_info.word
            start_time = word_info.start_time
            if word not in words:
                words[word] = []
            words[word].append({"start_time" : start_time.seconds})
        transcriptionResults['words'] = words
        
    data = {
        "success": True, 
        "result": transcriptionResults
    }

    return data
