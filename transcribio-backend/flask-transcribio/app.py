from flask import Flask, request, redirect, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
import json
import moviepy.editor as mp 
import speech_recognition as sr 
import pyrebase
import os
from dotenv import load_dotenv

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
	
	# TODO : Microsoft Azure speech-to-text conversion
	# convert_audio_to_text(video_clip.audio)

	# upload_audio_to_firebase(video_clip.audio)

	return "Audio extracted successfully"

def upload_audio_to_firebase(raw_audio):
	global firebase_config
	firebase = pyrebase.initialize_app(firebase_config)
	storage = firebase.storage()
	path_on_cloud = "audios/sample_audio.wav"
	path_local = os.path.join(app.config["AUDIO_UPLOADS"], "sample_audio.wav")
	storage.child(path_on_cloud).put(path_local)

app.run()

# def convert_audio_to_text(raw_audio):
# 	r = sr.Recognizer()

# 	# audio = sr.AudioFile("sample_audio.wav")
# 	audio = raw_audio
# 	with audio as source:
# 		audio_file = r.record(source, duration = 100)
# 		print("Transcription: "+r.recognize_google(audio_file, language='pt'))

# 	result = r.recognize_google(audio_file, language='pt')
# 	print(result)

# 	with open('recognized.txt',mode ='w') as file: 
#    		file.write("Recognized Speech:") 
#    		file.write("\n") 
#    		file.write(result) 
#    		print("ready!")

