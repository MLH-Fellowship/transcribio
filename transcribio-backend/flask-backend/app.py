from flask import Flask, request, jsonify
from urllib.request import urlopen, Request
import requests
from processing import process_video, get_permalink_doc
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
            video_file = request.files["videoFile"]
            video_file.save(video_file.filename)
            return process_video(video_file.filename)
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
            video_url = request.json["videoUrl"]
            req = Request(video_url, headers={'User-Agent': "transcribio"})
            meta = urlopen(req)
            main_type = meta.headers['Content-Type']
            if(main_type.startswith('video/')):
                filename = video_url.split('/')[-1]
                r = requests.get(video_url)
                with open(filename, 'wb') as video_file:
                    video_file.write(r.content)
                return process_video(filename)
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
def serve_permalink():
    try:
        if(request.args["uid"] is not None):
            # process file
            perm_id = request.args["uid"]
            return get_permalink_doc(perm_id)
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
