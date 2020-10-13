import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function DownloadTranscript(props) {
  const classes = useStyles();

  const downloadTxtFile = (transcript) => {
    const element = document.createElement("a");
    const file = new Blob([transcript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "transcript.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<GetAppIcon/>}
          onClick={() => downloadTxtFile(props.transcript)}
        >
          Download Transcript
        </Button>
      </div>
  );
}
