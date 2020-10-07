import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

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

const handleUrl = (event) => {
  event.preventDefault();
  const formData = event.target;
  let url = formData.url.value;
  let file = formData.file.value;
  if(!url && !file)
    console.log("no data"); // TODO: send an error
  else if(url) 
    console.log(url); // TODO: send url
  else if(file)
    console.log(file); // TODO: send file object

};

export default function ImportVideo() {
  const classes = useStyles();
  return (
    <form id="import-form" className={classes.form} onSubmit={handleUrl}>
      <div className={classes.formItem}>
        <TextField
          variant="standard"
          margin="normal"
          fullWidth
          id="url"
          label="Video Url"
          name="url"
          autoComplete="url"
          autoFocus
        />
        <label className={classes.upload}>
          Or upload a video
          <input id="file" name="file" type="file" />
        </label>
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.rightAlignedButton}
      >
        Transcribe!
      </Button>
    </form>
  );
}
