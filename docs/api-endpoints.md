# API Endpoints for Transcribio

### **POST** `/vFile`

The frontend sends the video file to the backend as a standard multipart/form-data

#### Input

```HTTP
POST /vFile? HTTP/1.1
Host: transcribio-mlh.web.app
Content-Type: multipart/form-data;
Content-Disposition: form-data; name="videoFile"; filename="/C:/fakepath/test.mp4"
```

Attributes

- multipart/form-data
  - videoFile : the file stream

#### Output

- Successful Processing

```json
{
    "success": true,
    "result": {
        "transcript": "This is a sample transcript",
        "keywords": [
            {
                "phrase": "sample transcript",
                "offset": 2, // in seconds
                "recommendations" : [
                    "link": "https://youtube.com/watch?v=sampleRecommendation",
                    ...
                ]
            },
            ...
        ],
        "permalink": "https://transcribio-mlh.web.app/perm/sample",
    }
}
```

- Unsuccessful 

```json
{
    "success": false,
    "message": "The file provided was not a valid video file",
    "errorCode": 100
}
```

### **POST** `/vUrl`

The frontend sends the video resource link to the backend in a standard json body

#### Input

```HTTP
POST /vUrl? HTTP/1.1
Host: transcribio-mlh.web.app
Content-Type: application/json

{
    "videoUrl": "https://samplevideourl/video.mp4"
}
```

Attributes

- raw | application/json
  - videoUrl : the URL to the video resource

#### Output

- Successful Processing

```json
{
    "success": true,
    "result": {
        "transcript": "This is a sample transcript",
        "keywords": [
            {
                "phrase": "sample transcript",
                "offset": 2, // in seconds
                "recommendations" : [
                    "link": "https://youtube.com/watch?v=sampleRecommendation",
                    ...
                ]
            },
            ...
        ],
        "permalink": "https://transcribio-mlh.web.app/perm/sample",
    }
}
```

- Unsuccessful 

```json
{
    "success": false,
    "message": "The url provided does not point to a valid video resource",
    "errorCode": 101
}
```

### **GET** `/perm`

To query data from a past processed video with the permalink uniqueID

#### Input

```HTTP
GET /perm/?uid=sample HTTP/1.1
Host: transcribio-mlh.web.app
```

Attributes

- uid : permalink unique id

#### Output

- Successful Processing

```json
{
    "success": true,
    "result": {
        "transcript": "This is a sample transcript",
        "keywords": [
            {
                "phrase": "sample transcript",
                "offset": 2, // in seconds
                "recommendations" : [
                    "link": "https://youtube.com/watch?v=sampleRecommendation",
                    ...
                ]
            },
            ...
        ],
        "permalink": "https://transcribio-mlh.web.app/perm/sample",
    }
}
```

- Unsuccessful 

```json
{
    "success": false,
    "message": "The permalink unique id does not refer to a valid document",
    "errorCode": 102
}
```