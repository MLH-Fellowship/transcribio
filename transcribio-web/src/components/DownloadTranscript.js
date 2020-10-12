import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    margin: '2vw',
    textAlign: 'center',
    width: '40%'
  }
}));

export default function DownloadTranscript(props) {
  const classes = useStyles();

  return (
      <div className={classes.main}>
        <h1>Full Transcript</h1>

        <p>{props.transcript}</p>
      </div>
  );
}
