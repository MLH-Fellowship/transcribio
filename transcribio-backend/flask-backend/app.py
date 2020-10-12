from flask import Flask, request, jsonify
from urllib.request import urlopen, Request
import requests
from processing import processVideo, getPermalinkDoc

app = Flask(__name__)


@app.route('/vFile', methods=['POST'])
def parseFile():
    try:
        if(request.files["videoFile"] is not None):
            # process file
            videoFile = request.files["videoFile"]
            videoFile.save(videoFile.filename)
            return processVideo(videoFile.filename)
    except Exception as err:
        print(err)
        response = {
            "success": False,
            "message": "The file provided was not a valid video file",
            "errorCode": 100
        }
        return jsonify(response)


@app.route('/vUrl', methods=['POST'])
def parseUrl():
    try:
        if(request.json["videoUrl"] is not None):
            # process file
            videoUrl = request.json["videoUrl"]
            req = Request(videoUrl, headers={'User-Agent': "transcribio"})
            meta = urlopen(req)
            mainType = meta.headers['Content-Type']
            if(mainType.startswith('video/')):
                filename = videoUrl.split('/')[-1]
                r = requests.get(videoUrl)
                with open(filename, 'wb') as videoFile:
                    videoFile.write(r.content)
                return processVideo(filename)
            else:
                raise Exception("Invalid MIME Type")
    except Exception as err:
        print(err)
        response = {
            "success": False,
            "message": "The url provided does not point to a valid video resource",
            "errorCode": 101
        }
        return jsonify(response)

@app.route('/perm', methods=['GET'])
def servePermalink():
    try:
        if(request.args["uid"] is not None):
            # process file
            perm_id = request.args["uid"]
            return getPermalinkDoc(perm_id)
    except Exception as err:
        print(err)
        response = {
            "success": False,
            "message": "The permalink unique id does not refer to a valid document",
            "errorCode": 102
        }
        return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
