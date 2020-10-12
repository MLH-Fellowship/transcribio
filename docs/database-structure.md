# Cloud Firestore Database Structure

## Collection `hash_link`

Maps file hashes to their permalink uid

```js
- hash_link
    - {file_hash}
        - perm_id: {permalink_uid}
    .
    .
    .
```

## Collection `link_data`

Maps permalink uid to the transcripted data

```json
- link_data
    - {perm_id}
        - {
            "success": true,
            "result": {
                "transcript": "This is a sample transcript",
                "words": {
                    // stores start time for each occurrence of the each word 
                    "sample": [{"start_time": 2}, {"start_time": 5}, ...], 
                    "word": [{"start_time": 4}],
                    ...
                },
                "keywords": ["sample keyword", "another word", ...],
                "permalink": "https://transcribio-mlh.web.app/perm/sample",
                "videoResource": "https://sample-link-to-a-bucket.mp4"
            }
        }
    .
    .
    .
```

We have two queries essentially,
- look up permalink uid by file hash
- look up data by permalink id
With the above structure we can do both queries in constant time and the data redundancy is also minimum