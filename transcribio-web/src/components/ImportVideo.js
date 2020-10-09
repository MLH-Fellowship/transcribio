import React from 'react';
import { LinearProgress, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
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
}));

const checkValidVideoUrl = videoUrl => {
  // send a request to backend microservice to check MIME type for the URL
  return false;
}

export default function ImportVideo() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = React.useState(false);
  const sendVideoUrlToBackend = (videoUrl) => {
    axios
      .post('video_endpoint', { video: videoUrl }) //add video endpoint
      .then((responseCode) => {
        setBusy(false);
      })
      .catch((errorCode) => {
        setBusy(false);
      });
  };
  const sendFileToBackend = (videoFile) => {
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
        setBusy(false);
      })
      .catch((errorCode) => {
        setBusy(false);
      });
  };
  const serveOnSnackbar = (message, variant) => {
    enqueueSnackbar(message, {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      variant: variant,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setBusy(true);
    const formData = event.target;
    let url = formData.url.value;
    let file = formData.file.files[0];
    if (!url && !file) {
      serveOnSnackbar(
        'To err is human 🦸‍♂️, enter a video link 🔗 or upload a video to transcribe',
        'error',
      );
      setBusy(false);
    } else if (url) {
      serveOnSnackbar(
        "We found that video link 🔗, let's ship it to our backend 🚢",
        'success',
      );
      sendVideoUrlToBackend(url);
    } else if (file) {
      serveOnSnackbar(
        "We found that video 🎉, let's ship it to our backend 🚢",
        'success',
      );
      sendFileToBackend(file);
    }
  };
  return (
    <form id="import-form" className={classes.form} onSubmit={handleSubmit}>
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
