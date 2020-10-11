import React from 'react';
import {
  LinearProgress,
  TextField,
  Button,
  withStyles,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import axios from 'axios';

const style = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  form: {
    width: '75%',
  },
  formItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upload: {
    marginLeft: theme.spacing(3),
  },
  rightAlignedButton: {
    float: 'right',
  },
});

const initalState = {
  busy: false
}

class ImportVideo extends React.Component {
  constructor(props) {
    super(props)
    this.state = initalState
  }
  setBusy = (busyState) => {
    this.setState({
      busy: busyState,
    });
  };
  sendVideoUrlToBackend = (videoUrl) => {
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
  handleSubmit = (event) => {
    event.preventDefault();
    this.setBusy(true);
    const formData = event.target;
    let url = formData.url.value;
    let file = formData.file.files[0];
    if (!url && !file) {
      this.serveOnSnackbar(
        'To err is human 🦸‍♂️, enter a video link 🔗 or upload a video to transcribe',
        'error',
      );
      this.setBusy(false);
    } else if (url) {
      this.serveOnSnackbar(
        "We found that video link 🔗, let's ship it to our backend 🚢",
        'success',
      );
      this.sendVideoUrlToBackend(url);
    } else if (file) {
      this.serveOnSnackbar(
        "We found that video 🎉, let's ship it to our backend 🚢",
        'success',
      );
      this.sendFileToBackend(file);
    }
  };

  render() {
    const { classes } = this.props;
    const { busy } = this.state;
    return (
      <form
        id="import-form"
        className={classes.form}
        onSubmit={this.handleSubmit}
      >
        <div className={classes.formItem}>
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            id="url"
            label="Give us a video url.."
            name="url"
            autoComplete="url"
            autoFocus
          />
          <label className={classes.upload}>
            Or upload a video
            <input id="file" name="file" type="file" accept="video/*" />
          </label>
        </div>
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          fullWidth
          disabled={busy}
          className={classes.rightAlignedButton}
        >
          {busy ? 'Transcribing...' : 'Transcribe!'}
        </Button>
        {busy && <LinearProgress />}
      </form>
    );
  }
}

export default withSnackbar(withStyles(style)(ImportVideo));