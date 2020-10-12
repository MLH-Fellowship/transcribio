from flask import Flask, request, redirect, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
import json
import moviepy.editor as mp 
import pyrebase
import os
import io
from dotenv import load_dotenv
from google.cloud import speech

app = Flask(__name__)

project_folder = os.path.expanduser('D:\\MLH\\Sprint 1\\transcribio\\transcribio-backend\\flask-transcribio')
load_dotenv(os.path.join(project_folder, '.env'))
print(os.getenv("apiKey"))

firebase_config = {
		"apiKey": os.getenv("apiKey"),
		"authDomain": os.getenv("authDomain") ,
		"databaseURL": os.getenv("databaseURL"),
		"projectId": os.getenv("projectId"),
		"storageBucket": os.getenv("storageBucket"),
		"messagingSenderId":os.getenv("messagingSenderId") ,
		"appId": os.getenv("appId"),
		"measurementId":os.getenv("measurementId")
}

app.config["VIDEO_UPLOADS"] = "D:\\MLH\\Sprint 1\\transcribio\\transcribio-backend\\flask-transcribio\\static\\video\\uploads"
app.config["AUDIO_UPLOADS"] = "D:\\MLH\\Sprint 1\\transcribio\\transcribio-backend\\flask-transcribio\\static\\audio"

# Endpoint for taking the link of a YouTube video and returns the transcriptions. 
# Shows error for videos that have subtitles disabled.
@app.route("/youtube", methods = ["POST"])
def transcribe_youtube_video():
	video_id = request.args.get('video_id')
	transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
	json_object = json.dumps(transcript_list, indent = 4)   

	return json_object

# TODO: Separate route for video link to be downloaded (text)

# Upload mp4 video. Input is an mp4 file (multi-part form data)
@app.route("/upload-video", methods = ["GET", "POST"])
def upload_video():
	if request.method == "POST":		
		if request.files:
			# Set name attribute to "video" in input
			video = request.files["video"]
			print(video.filename)
			
			if video.filename == "":
				print ("Video must have a filename")
				return redirect(request.url)
			
			upload_video_to_firebase(video)
			video.save(os.path.join(app.config["VIDEO_UPLOADS"], video.filename))

			print("Video saved")
			
			extract_audio_from_mp4(video)
			return redirect(request.url)

	if request.method == "POST" and request.files is None:
		return "Video not found"
	else:
		return "Video found and uploaded successfully"

def upload_video_to_firebase(raw_video):
	global firebase_config
	firebase = pyrebase.initialize_app(firebase_config)
	storage = firebase.storage()
	path_on_cloud = "videos/sample_video.mp4"
	path_local = os.path.join(app.config["VIDEO_UPLOADS"], raw_video.filename)
	storage.child(path_on_cloud).put(path_local)

def extract_audio_from_mp4(raw_video):
	video_clip = mp.VideoFileClip(os.path.join(app.config["VIDEO_UPLOADS"], raw_video.filename))	
	video_clip.audio.write_audiofile(os.path.join(app.config["AUDIO_UPLOADS"],"sample_audio.wav"))
	
	# Speech-to-text conversion
	# convert_audio_to_text()

	# upload_audio_to_firebase(video_clip.audio)

	return "Audio extracted successfully"

def upload_audio_to_firebase(raw_audio):
	global firebase_config
	firebase = pyrebase.initialize_app(firebase_config)
	storage = firebase.storage()
	path_on_cloud = "audios/sample_audio.wav"
	path_local = os.path.join(app.config["AUDIO_UPLOADS"], "sample_audio.wav")
	storage.child(path_on_cloud).put(path_local)


@app.route("/transcribe", methods = ["GET"])
def convert_audio_to_text():
	raw_audio = request.files.get('raw_audio')
	client = speech.SpeechClient()
	
	audio = speech.RecognitionAudio(content=raw_audio.read())
	config = speech.RecognitionConfig(
		encoding=speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
		sample_rate_hertz=16000,
		language_code="en-US",
		enable_word_time_offsets=True,
	)

	# Detects speech in the audio file
	response = client.recognize(request={"config": config, "audio": audio})

	resultData = {}

	resultData['transcript'] = ""
	words = {}

	for result in response.results:
		alternative = result.alternatives[0]
		resultData['transcript'] += alternative.transcript
		for word_info in alternative.words:
			word = word_info.word
			start_time = word_info.start_time
			if word not in words:
				words[word] = []
			words[word].append({"start_time" : start_time.seconds})
		resultData['words'] = words

	data = {
		"success": True, 
		"result": resultData
	}

	return data

app.run()

