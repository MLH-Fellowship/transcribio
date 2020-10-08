import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
    textTransform: 'none',
  },
}));

const checkValidVideoUrl = (videoUrl) => {
  // send a request to backend microservice to check MIME type for the URL
  return false;
};

export default function ImportVideo() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = React.useState(false);
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
    let file = formData.file.value;
    if (!url && !file) {
      serveOnSnackbar(
        'To err is human 🦸‍♂️, enter a video link 🔗 or upload a video to transcribe',
        'error',
      );
    } else if (url) {
      if (checkValidVideoUrl(url))
        serveOnSnackbar(
          "We found that video! Let's ship it to our backend 🚢",
          'success',
        );
      else
        serveOnSnackbar(
          'To err is human 🦸‍♂️, we could not find the video on the link 🔗',
          'error',
        );
    } else if (file) {
      serveOnSnackbar(
        "We found that video! Let's ship it to our backend 🚢",
        'success',
      );
    }
    //setBusy(false);
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
      <div >
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
        {busy && (
          <LinearProgress />
        )}
      </div>
    </form>
  );
}
