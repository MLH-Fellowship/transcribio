import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ImportVideo() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      Hello world!
    </div>
  );
}
