import React from 'react';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import ImportVideo from './ImportVideo';
import { CssBaseline, Typography, withStyles } from '@material-ui/core';
import '../../node_modules/video-react/dist/video-react.css';
import SearchKeyword from './SearchKeyword';
import Keyword from './Keyword';
import DownloadTranscript from './DownloadTranscript';
import MainKeywords from './MainKeywords';
import {
  Player,
  ControlBar,
  BigPlayButton,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton,
} from 'video-react';

const style = (theme) => ({
  root: {
    height: '95vh',
    width: '95vw', 
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  sub: {
    marginBottom: 10,
  },
  paper: {
    margin: theme.spacing(2, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%'
  },
  menuItem: {
    margin: '2vw',
    width: '30%'
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    overflow: 'hidden',
  }
});

const initalState = {
  busy: false,
  videoUrl: '',
  videoFile: null,
  videoFileUrl: '',
  inputAvailable: false,
  transcriptionResult: {},
};

class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = initalState;
  }

  setBusy = (busyState) => {
    this.setState({
      busy: busyState,
    });
  };

  componentDidUpdate() {
    // subscribe state change
    if (this.state.inputAvailable) {
      this.player.subscribeToStateChange(this.handleStateChange);
    }
  }

  handleStateChange = (state) => {
    // copy player state to this component's state
    this.setState({
      player: state,
    });
  };

  seek = (seconds) => {
    this.player.seek(seconds);
  };

  searchKeyword = (keyword) => {
    if(this.state.transcriptionResult.words[keyword]) {
      this.setState({
        searchKeyword: keyword,
        searchTimestamps: this.state.transcriptionResult.words[keyword],
        searchError: false
      })
    }
    else {
      this.setState({
        searchKeyword: keyword,
        searchTimestamps: null,
        searchError: true
      })
    }
  }

  sendVideoUrlToBackend = (videoUrl) => {
    axios
      .post('http://127.0.0.1:5000/vUrl', { videoUrl }) //add video endpoint
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success) {
            this.setState({ 
              transcriptionResult: response.data.result,
              videoUrl,
              inputAvailable: true
            });
          }
        }
        this.setBusy(false);
      })
      .catch((error) => {
        console.log(error)
        this.setBusy(false);
      });
    this.setState({
      videoUrl,
      inputAvailable: true,
    });
  };

  sendFileToBackend = (videoFile) => {
    let formData = new FormData();
    formData.append('videoFile', videoFile);
    axios
      .post('http://127.0.0.1:5000/vFile', formData, {
        //add video endpoint
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success) {
            this.setState({ 
              transcriptionResult: response.data.result,
              videoFile,
              videoFileUrl: URL.createObjectURL(videoFile),
              inputAvailable: true
            });
          }
        }
        this.setBusy(false);
      })
      .catch((error) => {
        console.log(error);
        this.setBusy(false);
      });
  };

  serveOnSnackbar = (message, variant, horizontal, vertical) => {
    this.props.enqueueSnackbar(message, {
      anchorOrigin: {
        horizontal,
        vertical,
      },
      variant,
    });
  };

  displaySearchError = (keyword) => {
    this.serveOnSnackbar(`Keyword "${this.state.searchKeyword}" is not found in the video`, "error", 'left', 'bottom');
    this.setState({
      searchError: false,
      searchKeyword: null
    })
  }

  render() {
    const { classes } = this.props;
    const { videoFile, videoUrl, videoFileUrl, inputAvailable } = this.state;

    return (
      <div component="main" className={classes.root}>
        <CssBaseline />
        <div className={classes.paper}>
          <Typography className={classes.header} variant="h2" center="center">
            transcribio
          </Typography>
          <Typography className={classes.sub} variant="h5" align="center">
            Making Video Lectures Accessible
          </Typography>
          <ImportVideo
            setBusy={(busyState) => this.setBusy(busyState)}
            busy={this.state.busy}
            serveOnSnackbar={(m, v) => this.serveOnSnackbar(m, v, 'right', 'top')}
            sendFileToBackend={(f) => this.sendFileToBackend(f)}
            sendVideoUrlToBackend={(u) => this.sendVideoUrlToBackend(u)}
          />
          {inputAvailable && (
            <div className={classes.paper}>
              <div className={classes.menu}>
                <DownloadTranscript transcript={this.state.transcriptionResult.transcript}/>
              </div>
              <Player
                className={classes.paper}
                ref={(player) => {
                  this.player = player;
                }}
                src={videoUrl ? videoUrl : videoFile ? videoFileUrl : ''}
                fluid={false}
                width={800}
                height={500}
              >
                <BigPlayButton position="center" />
                <ControlBar autoHide={false} disableDefaultControls={false}>
                  <ReplayControl seconds={10} order={1.1} />
                  <ForwardControl seconds={30} order={1.2} />
                  <CurrentTimeDisplay order={4.1} />
                  <TimeDivider order={4.2} />
                  <PlaybackRateMenuButton
                    rates={[5, 2, 1.5, 1, 0.5]}
                    order={7.1}
                  />
                  <VolumeMenuButton />
                </ControlBar>
              </Player>
              <div className={classes.menu}>
                <div className={classes.menuItem}>
                  <SearchKeyword searchFunction={this.searchKeyword}/>
                  {this.state.searchError ? this.displaySearchError(this.state.searchKeyword) : 
                  this.state.searchKeyword ? <Keyword keyword={this.state.searchKeyword} timestamps={this.state.searchTimestamps} seek={this.seek}/> : null}
                </div>
                <div className={classes.menuItem}>
                  <MainKeywords transcriptionResult={this.state.transcriptionResult} seek={this.seek}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withSnackbar(withStyles(style)(AppLayout));
