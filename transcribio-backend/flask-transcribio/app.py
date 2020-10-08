from flask import Flask, request, redirect
from youtube_transcript_api import YouTubeTranscriptApi
import json
import moviepy.editor as mp 
import speech_recognition as sr 

import os

app = Flask(__name__)

# Doesn't work for videos that have disabled subtitles
@app.route("/youtube")
def transcribe_youtube_video():
	
	video_id = 'sVxBVvlnJsM'

	transcript_list = YouTubeTranscriptApi.get_transcript(video_id)

	json_object = json.dumps(transcript_list, indent = 4)   

	print(json_object)

	return json_object

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
			
			video.save(os.path.join(app.config["VIDEO_UPLOADS"], video.filename))

			print("Video saved")
			
			extract_audio_from_mp4(video)
			
			return redirect(request.url)

	if request.method == "POST" and request.files is None:
		return "Video not found"
	else:
		return "Video found and uploaded successfully"

app.config["VIDEO_UPLOADS"] = "D:\\MLH\\transcribio\\transcribio-backend\\flask-transcribio\\static\\video\\uploads"
app.config["AUDIO_UPLOADS"] = "D:\\MLH\\transcribio\\transcribio-backend\\flask-transcribio\\static\\audio"

def extract_audio_from_mp4(raw_video):
	
	clip = mp.VideoFileClip(os.path.join(app.config["VIDEO_UPLOADS"], raw_video.filename))
	clip.audio.write_audiofile(os.path.join(app.config["AUDIO_UPLOADS"],"sample_audio.wav"))  

	return "Audio extracted successfully"

def convert_audio_to_text(raw_audio):
	r = sr.Recognizer()

	audio = sr.AudioFile("sample_audio.wav")

	with audio as source:
		audio_file = r.record(source, duration = 100)

	result = r.recognize_google(audio_file)
	print(result)

	with open('recognized.txt',mode ='w') as file: 
   		file.write("Recognized Speech:") 
   		file.write("\n") 
   		file.write(result) 
   		print("ready!")

app.run()