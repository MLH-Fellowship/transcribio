import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%'
  },
  upload: {
    marginLeft: theme.spacing(3),
  },
  rightAlignedButton: {
    float: 'right',
  },
}));

export default function ImportVideo(props) {
  const classes = useStyles();
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.searchFunction(keyword);
  }

  return (
    <form id="import-form" className={classes.form} onSubmit={handleSubmit}>
      <TextField
        variant="standard"
        margin="normal"
        id="url"
        label="Search Keyword..."
        fullWidth
        name="url"
        value={keyword}
        onInput= { e => setKeyword(e.target.value)}
        />
      <Button
        type="submit"
        variant="outlined"
        color="primary"
        className={classes.rightAlignedButton}
      >
        Search
    </Button>
    </form>
  );
}
