import React from 'react';
import {
  LinearProgress,
  TextField,
  Button,
  withStyles,
} from '@material-ui/core';

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
    textTransform: 'none',
  },
});

class ImportVideo extends React.Component {

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.setBusy(true);
    const formData = event.target;
    let url = formData.url.value;
    let file = formData.file.files[0];
    if (!url && !file) {
      this.props.serveOnSnackbar(
        'To err is human 🦸‍♂️, enter a video link 🔗 or upload a video to transcribe',
        'error',
      );
      this.props.setBusy(false);
    } else if (url) {
      this.props.serveOnSnackbar(
        "We found that video link 🔗, let's ship it to our backend 🚢",
        'success',
      );
      this.props.sendVideoUrlToBackend(url);
    } else if (file) {
      this.props.serveOnSnackbar(
        "We found that video 🎉, let's ship it to our backend 🚢",
        'success',
      );
      this.props.sendFileToBackend(file);
    }
  };

  render() {
    const { classes, busy } = this.props;

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

export default withStyles(style)(ImportVideo);
