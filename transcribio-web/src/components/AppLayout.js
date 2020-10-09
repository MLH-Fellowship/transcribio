import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ImportVideo from './ImportVideo';

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
    VolumeMenuButton
  } from 'video-react';

const useStyles = (theme) => ({
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
  image: {
    backgroundImage: 'url(https://picsum.photos/1000)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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

class AppLayout extends React.Component {

  componentDidMount() {
    // subscribe state change
    this.player.subscribeToStateChange(this.handleStateChange);
  }

  handleStateChange = (state) => {
    // copy player state to this component's state
    this.setState({
      player: state
    });
  }

  seek = (seconds) => {
    this.player.seek(seconds);
  }

  render() {
    const { classes } = this.props;

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
          <ImportVideo />
          <Player
                ref={player => {
                  this.player = player;
                }}
                src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
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
                    <PlaybackRateMenuButton rates={[5, 2, 1.5, 1, 0.5]} order={7.1} />
                    <VolumeMenuButton />
                </ControlBar>
          </Player>
          <button onClick={() => this.seek(20)} className={classes.timestamp}>0:20</button>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(AppLayout);