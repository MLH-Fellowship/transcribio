from flask import Flask, request, jsonify
from urllib.request import urlopen, Request
import requests
from processing import processVideo
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/vFile', methods=['POST'])
@cross_origin()
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
@cross_origin()
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


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
