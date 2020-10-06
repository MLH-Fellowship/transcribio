import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ImportVideo from './ImportVideo';

const useStyles = makeStyles((theme) => ({
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
}));

export default function AppLayout() {
  const classes = useStyles();

  return (
    <div container component="main" className={classes.root}>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography className={classes.header} variant="h2" center="center">
          transcribio
        </Typography>
        <Typography className={classes.sub} variant="h5" align="center">
          Making Video Lectures Accessible
        </Typography>
        <ImportVideo />
      </div>
    </div>
  );
}
