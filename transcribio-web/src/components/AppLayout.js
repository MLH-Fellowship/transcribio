import React from 'react';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import ImportVideo from './ImportVideo';
import { CssBaseline, Typography, withStyles } from '@material-ui/core';
import '../../node_modules/video-react/dist/video-react.css';
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
    height: '100vh',
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
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    overflow: 'hidden',
  },
});

const initalState = {
  busy: false,
  videoUrl: '',
  videoFile: null,
  videoFileUrl: '',
  inputAvailable: false,
};

class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = initalState;
  }

  setBusy = (busyState) => {
    console.log('busy');
    this.setState({
      busy: busyState,
    });
  };

  componentDidUpdate() {
    // subscribe state change
    if (this.state.inputAvailable)
      this.player.subscribeToStateChange(this.handleStateChange);
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

  sendVideoUrlToBackend = (videoUrl) => {
    this.setState({
      videoUrl: videoUrl,
      inputAvailable: true,
    });
    axios
      .post('video_endpoint', { video: videoUrl }) //add video endpoint
      .then((responseCode) => {
        this.setBusy(false);
      })
      .catch((errorCode) => {
        this.setBusy(false);
      });
  };

  sendFileToBackend = (videoFile) => {
    console.log(URL.createObjectURL(videoFile));
    this.setState({
      videoFile: videoFile,
      videoFileUrl: URL.createObjectURL(videoFile),
      inputAvailable: true,
    });
    let formData = new FormData();
    formData.append('video', videoFile);
    axios
      .post('video_endpoint', formData, {
        //add video endpoint
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((responseCode) => {
        this.setBusy(false);
      })
      .catch((errorCode) => {
        this.setBusy(false);
      });
  };

  serveOnSnackbar = (message, variant) => {
    this.props.enqueueSnackbar(message, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      variant: variant,
    });
  };

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
            serveOnSnackbar={(m, v) => this.serveOnSnackbar(m, v)}
            sendFileToBackend={(f) => this.sendFileToBackend(f)}
            sendVideoUrlToBackend={(u) => this.sendVideoUrlToBackend(u)}
          />
          {inputAvailable && (
            <div className={classes.paper}>
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
              <button
                onClick={() => this.seek(20)}
                className={classes.timestamp}
              >
                0:20
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withSnackbar(withStyles(style)(AppLayout));
