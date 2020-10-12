import os
import ffmpeg
import hashlib
from google.cloud import speech
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('creds\\firebase.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
hash_code = ''


def processVideo(videoFileName):
    fileDoc = checkExistingDocuments(videoFileName)
    if fileDoc:
        os.remove(videoFileName)
        return fileDoc
    else:
        return extractAudio(videoFileName)


def checkExistingDocuments(videoFileName):
    hash_md5 = hashlib.md5()
    with open(videoFileName, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    global hash_code, db
    hash_code = hash_md5.hexdigest()
    print(hash_code, db)
    doc = db.collection(u'hash_link').document(u'{}'.format(hash_code)).get()
    if doc.exists:
        return db.collection(u'link_data').document(u'{}'.format(doc.to_dict()['perm_id'])).get().to_dict()
    else:
        return False


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
            words[word].append({"start_time": start_time.seconds})
        transcriptionResults['words'] = words

    data = {
        "success": True,
        "result": transcriptionResults
    }

    return saveDataToFirestore(data)


def saveDataToFirestore(data):
    global db, hash_code
    perm_id = hash_code[-8:]
    data['permalink'] = "https://transcribio-mlh.web.app/{}".format(perm_id)
    db.collection(u'hash_link').document(
        u'{}'.format(hash_code)).set({'perm_id': perm_id})
    db.collection(u'link_data').document(u'{}'.format(perm_id)).set(data)

    return data
