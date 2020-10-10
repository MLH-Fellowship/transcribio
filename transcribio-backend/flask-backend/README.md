# Flask Backend for Transcribio

### Requirements

- Python 3.x
- ffmpeg
    - `sudo apt install ffmpeg`
    - [Binary for Windows](https://ffmpeg.org/download.html#build-windows)

### Getting Started

1. Setting up virtual environment for local development
    - `virtualenv venv` 
2. Install dependencies
    - `pip install -r requirements.txt`
3. optional - to enable Debug Mode)
    - `set FLASK_DEBUG=1` (for Windows) 
4. Run flask server locally
    - `python -m flask run`